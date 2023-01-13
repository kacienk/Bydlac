import pytest
from datetime import datetime
import pytz

from django.core.exceptions import ObjectDoesNotExist
from django.utils.dateparse import parse_datetime

from base.models import Event, ConversationGroup


@pytest.mark.django_db
def test_event_list(auth_client, create_user, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    event1 = create_event(name='testevent1', host=user1)
    event2 = create_event(name='testevent2', host=user1)

    response = client.get(f'/api/events/')
    data = response.data
    
    assert response.status_code == 200, f'{response.data}'
    assert len(data) == 2
    assert data[0]['host'] == user1.id
    assert data[1]['host'] == user1.id
    assert data[0]['name'] == event1.name
    assert data[1]['name'] == event2.name


@pytest.mark.django_db
def test_event_create(auth_client, create_user):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC).isoformat()
    print(expiration_date)
    payload = dict(name='testevent', expires=expiration_date)    
    response = client.post(f'/api/events/', payload)
    data = response.data
    

    assert response.status_code == 201, f'{response.data}'
    try:
        event = Event.objects.get(id=data['id'])
        
        assert data['id'] == event.id
        assert data['name'] == event.name
        assert len(event.participants.all()) == 1
    except ObjectDoesNotExist:
        assert False


@pytest.mark.django_db
def test_event_retrieve(auth_client, create_user, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    host = create_user(username='testhost')
    event = create_event(host=host, name='testevent', description='test', expires=expiration_date)

    response = client.get(f'/api/events/{event.id}/')
    data = response.data
    
    assert response.status_code == 200, f'{response.data}'
    assert data['host'] == host.id
    assert data['name'] == event.name
    assert data['description'] == event.description
    assert parse_datetime(data['expires']) == event.expires


@pytest.mark.django_db
def test_event_update(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    event = create_event(host=user1, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=user1, name=event.name, description=event.description)
    event.group = group
    event.save()

    new_expiration_date = datetime(2023, 4, 1, 12, 0, 0, 0, pytz.UTC)
    payload = dict(name='newname', description='newdescription', expires=new_expiration_date.isoformat())
    response = client.patch(f'/api/events/{event.id}/', payload)
    data = response.data
    
    event.refresh_from_db()
    group.refresh_from_db()

    assert response.status_code == 202, f'{response.data}'
    assert data['name'] == payload['name']
    assert data['description'] == payload['description']
    assert parse_datetime(data['expires']) == new_expiration_date
    assert data['host'] == user1.id
    assert payload['name'] == event.name
    assert payload['description'] == event.description
    assert parse_datetime(payload['expires']) == event.expires
    assert payload['name'] == group.name
    assert payload['description'] == group.description


@pytest.mark.django_db
def test_event_update_fail_not_host(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    host = create_user(username='testhost')
    event = create_event(host=host, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=host, name=event.name, description=event.description)
    event.group = group

    new_expiration_date = datetime(2023, 4, 1, 12, 0, 0, 0, pytz.UTC)
    payload = dict(name='newname', description='newdescription', expires=new_expiration_date.isoformat())
    response = client.patch(f'/api/events/{event.id}/', payload)
    response.data
    
    event.refresh_from_db()
    group.refresh_from_db()

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_event_delete(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    event = create_event(host=user1, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=user1, name=event.name, description=event.description)
    event.group = group
    event.save()

    response = client.delete(f'/api/events/{event.id}/')

    assert response.status_code == 204, f'{response.data}'
    with pytest.raises(Event.DoesNotExist):
        event.refresh_from_db()
    with pytest.raises(ConversationGroup.DoesNotExist):
        group.refresh_from_db()


@pytest.mark.django_db
def test_event_delete_fail_not_host(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    host = create_user(username='testhost')
    event = create_event(host=host, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=host, name=event.name, description=event.description)
    event.group = group
    event.save()

    response = client.delete(f'/api/events/{event.id}/')

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_event_participants_list(auth_client, create_user, create_group, create_event, add_user_to_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    event = create_event(host=user1, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=user1, name=event.name, description=event.description)
    event.group = group
    event.save()

    user2 = create_user(username='testuser2')
    user3 = create_user(username='testuser3')
    add_user_to_event(event=event, user=user2)
    add_user_to_event(event=event, user=user3)

    response = client.get(f'/api/events/{event.id}/participants/')
    data = response.data

    assert response.status_code == 200, f'{response.data}'
    assert data[0]['id'] == user1.id
    assert data[0]['username'] == user1.username
    assert data[1]['id'] == user2.id
    assert data[1]['username'] == user2.username
    assert data[2]['id'] == user3.id
    assert data[2]['username'] == user3.username


@pytest.mark.django_db
def test_event_join(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    host = create_user(username='testhost')
    event = create_event(host=host, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=host, name=event.name, description=event.description)
    event.group = group
    event.save()

    response = client.get(f'/api/events/{event.id}/join/')
    
    event.refresh_from_db()

    assert response.status_code == 202, f'{response.data}'


@pytest.mark.django_db
def test_event_join_fail_already_participant(auth_client, create_user, create_group, create_event, add_user_to_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    host = create_user(username='testhost')
    event = create_event(host=host, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=host, name=event.name, description=event.description)
    event.group = group
    event.save()

    add_user_to_event(event=event, user=user1)

    response = client.get(f'/api/events/{event.id}/join/')
    
    event.refresh_from_db()

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_event_join_fail_participants_limit_reached(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    host = create_user(username='testhost')
    event = create_event(host=host, name='testevent', description='test', expires=expiration_date, max_participants=1)
    group = create_group(host=host, name=event.name, description=event.description)
    event.group = group
    event.save()

    response = client.get(f'/api/events/{event.id}/join/')
    
    event.refresh_from_db()

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_event_leave(auth_client, create_user, create_group, create_event, add_user_to_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    host = create_user(username='testhost')
    event = create_event(host=host, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=host, name=event.name, description=event.description)
    event.group = group
    event.save()

    add_user_to_event(event=event, user=user1)

    response = client.get(f'/api/events/{event.id}/leave/')
    
    event.refresh_from_db()

    assert response.status_code == 202, f'{response.data}'
    with pytest.raises(ObjectDoesNotExist):
        event.participants.get(id=user1.id)


@pytest.mark.django_db
def test_event_leave_fail_user_is_host(auth_client, create_user, create_group, create_event, add_user_to_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    event = create_event(host=user1, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=user1, name=event.name, description=event.description)
    event.group = group
    event.save()

    response = client.get(f'/api/events/{event.id}/leave/')
    
    event.refresh_from_db()

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_event_group_retrieve(auth_client, create_user, create_group, create_event, add_user_to_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    event = create_event(host=user1, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=user1, name=event.name, description=event.description)
    event.group = group
    event.save()

    add_user_to_event(event=event, user=user1)

    response = client.get(f'/api/events/{event.id}/group/')
    data = response.data

    assert response.status_code == 202, f'{response.data}'
    assert data['host'] == group.host.id
    assert data['name'] == group.name


@pytest.mark.django_db
def test_event_group_retrieve(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    event = create_event(host=user1, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=user1, name=event.name, description=event.description)
    event.group = group
    event.save()

    response = client.get(f'/api/events/{event.id}/group/')
    data = response.data

    assert response.status_code == 200, f'{response.data}'
    assert data['host'] == group.host.id
    assert data['name'] == group.name


@pytest.mark.django_db
def test_event_group_retrieve_fail_no_group(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    event = create_event(host=user1, name='testevent', description='test', expires=expiration_date)
    event.save()

    response = client.get(f'/api/events/{event.id}/group/')

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_event_group_retrieve_fail_not_participant(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    host = create_user(username='testhost')
    event = create_event(host=host, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=host, name=event.name, description=event.description)
    event.group = group
    event.save()

    response = client.get(f'/api/events/{event.id}/group/')

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_event_group_create(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    event = create_event(host=user1, name='testevent', description='test', expires=expiration_date)

    response = client.post(f'/api/events/{event.id}/group/')
    data = response.data

    event.refresh_from_db()
    group = event.group

    assert response.status_code == 201, f'{response.data}'
    assert group is not None
    assert data['id'] == group.id
    assert data['host'] == group.host.id
    assert data['name'] == group.name
    assert group.name == event.name
    assert group.description == event.description


@pytest.mark.django_db
def test_event_group_create_fail_not_host(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    host = create_user(username='testhost')
    event = create_event(host=host, name='testevent', description='test', expires=expiration_date)

    response = client.post(f'/api/events/{event.id}/group/')

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_event_group_create_fail_group_exists(auth_client, create_user, create_group, create_event):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    expiration_date = datetime(2023, 3, 1, 12, 0, 0, 0, pytz.UTC)
    event = create_event(host=user1, name='testevent', description='test', expires=expiration_date)
    group = create_group(host=user1, name=event.name, description=event.description)
    event.group = group
    event.save()

    response = client.post(f'/api/events/{event.id}/group/')

    assert response.status_code == 403, f'{response.data}'

