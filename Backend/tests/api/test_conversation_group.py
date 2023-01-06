import pytest
from datetime import datetime

from django.core.exceptions import ObjectDoesNotExist
from django.utils.dateparse import parse_datetime

from base.models import ConversationGroup
from base.serializers import ConversationGroupSerializer, DetailedConversationGroupSerializer


@pytest.mark.django_db
def test_conversation_group_list_non_private(auth_client, create_user, create_group):
    user = create_user(username='testuser')
    client = auth_client(user)

    user2 = create_user(username='testuser2')
    group1 = create_group(host=user2, name='group1', is_private=False)
    group2 = create_group(host=user2, name='group2')
    group3 = create_group(host=user2, name='group3', is_private=False)
    group4 = create_group(host=user2, name='group4')

    response = client.get('/api/groups/')
    data = response.data
    data = sorted(data, key=lambda x: x.get('id'))

    assert response.status_code == 200
    assert len(data) == 2
    assert data[0].get('id') == group1.id
    assert data[1].get('id') == group3.id
    assert data[0].get('name') == group1.name
    assert data[1].get('name') == group3.name


@pytest.mark.django_db
def test_conversation_group_list_all(client, create_superuser, create_user, auth_user, create_group):
    superuser = create_superuser(username='testuser')
    auth_response = auth_user(superuser)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

    user2 = create_user(username='testuser2')
    group1 = create_group(host=user2, name='group1', is_private=False)
    group2 = create_group(host=user2, name='group2')
    group3 = create_group(host=user2, name='group3', is_private=False)
    group4 = create_group(host=user2, name='group4')

    response = client.get('/api/groups/all/')
    data = response.data
    data = sorted(data, key=lambda x: x.get('id'))

    assert response.status_code == 200
    assert len(data) == 4
    assert data[0].get('id') == group1.id
    assert data[1].get('id') == group2.id
    assert data[2].get('id') == group3.id
    assert data[3].get('id') == group4.id
    assert data[0].get('name') == group1.name
    assert data[1].get('name') == group2.name
    assert data[2].get('name') == group3.name
    assert data[3].get('name') == group4.name


@pytest.mark.django_db
def test_conversation_group_list_all_fail_not_admin(auth_client, create_user, create_group):
    user = create_user(username='testuser')
    client = auth_client(user)

    user2 = create_user(username='testuser2')
    group1 = create_group(host=user2, name='group1', is_private=False)
    group2 = create_group(host=user2, name='group2')
    group3 = create_group(host=user2, name='group3', is_private=False)
    group4 = create_group(host=user2, name='group4')

    response = client.get('/api/groups/all/')

    assert response.status_code == 403


@pytest.mark.django_db
def test_conversation_group_create(auth_client, create_user):
    user = create_user(username='testuser')
    client = auth_client(user)

    response = client.post('/api/groups/', dict(name='testgroup', is_private=False))
    data = response.data

    assert response.status_code == 201
    
    try:
        testgroup = ConversationGroup.objects.get(name='testgroup')
        
        assert data['id'] == testgroup.id
        assert data['name'] == testgroup.name
        assert data['is_private'] == testgroup.is_private
        assert testgroup.name == 'testgroup'
        assert testgroup.is_private == False
    except ObjectDoesNotExist:
        assert False

    
@pytest.mark.django_db
def test_conversation_group_create_fail_two_groups_with_the_same_name(auth_client, create_user, create_group):
    user = create_user(username='testuser')
    client = auth_client(user)
    group = create_group(host=user, name='testgroup')

    response = client.post('/api/groups/', dict(name='testgroup', is_private=False))

    assert response.status_code == 400


@pytest.mark.django_db
def test_conversation_group_create_fail_no_name_given(auth_client, create_user):
    user = create_user(username='testuser')
    client = auth_client(user)

    response = client.post('/api/groups/', dict(is_private=False))

    assert response.status_code == 400


@pytest.mark.django_db
def test_conversation_group_retrieve(auth_client, create_user, create_group):
    user = create_user(username='testuser')
    client = auth_client(user)
    group = create_group(host=user, name='testgroup')

    response = client.get(f'/api/groups/{group.id}/')
    data = response.data

    assert response.status_code == 200
    assert data['id'] == group.id
    assert data['name'] == group.name
    assert parse_datetime(data['last_message']) == group.last_message


@pytest.mark.django_db
def test_conversation_group_retrieve_fail_bad_id(auth_client, create_user):
    user = create_user(username='testuser')
    client = auth_client(user)

    response = client.get(f'/api/groups/-1/')

    assert response.status_code == 404


@pytest.mark.django_db
def test_conversation_group_retrieve_fail_not_member(auth_client, create_user, create_group):
    user = create_user(username='testuser')
    client = auth_client(user)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')

    response = client.get(f'/api/groups/{group.id}/')

    assert response.status_code == 403


@pytest.mark.django_db
def test_conversation_group_update_host(auth_client, create_user, create_group):
    user = create_user(username='testuser')
    client = auth_client(user)
    group = create_group(host=user, name='testgroup')

    payload = dict(description="testdescription", is_private=False)
    response = client.patch(f'/api/groups/{group.id}/', payload)
    data = response.data
    group.refresh_from_db()

    assert response.status_code == 200
    assert data['id'] == group.id
    assert group.description == payload['description']
    assert group.is_private == payload['is_private']


@pytest.mark.django_db
def test_conversation_group_update_moderator(auth_client, create_user, create_group, add_user_to_group):
    moderator = create_user(username='testmoderator')
    client = auth_client(moderator)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    add_user_to_group(user=moderator, group=group, is_moderator=True)
    
    payload = dict(description="testdescription", is_private=False)
    response = client.patch(f'/api/groups/{group.id}/', payload)
    data = response.data
    
    group.refresh_from_db()

    assert response.status_code == 200
    assert data['id'] == group.id
    assert group.description == payload['description']
    assert group.is_private == payload['is_private']


@pytest.mark.django_db
def test_conversation_group_update_fail_regular_member(auth_client, create_user, create_group, add_user_to_group):
    user = create_user(username='testuser')
    client = auth_client(user)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    add_user_to_group(user=user, group=group, is_moderator=False)
    
    payload = dict(description="testdescription", is_private=False)
    response = client.patch(f'/api/groups/{group.id}/', payload)

    assert response.status_code == 403


@pytest.mark.django_db
def test_conversation_group_update_fail_not_member(auth_client, create_user, create_group):
    user = create_user(username='testuser')
    client = auth_client(user)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    
    payload = dict(description="testdescription", is_private=False)
    response = client.patch(f'/api/groups/{group.id}/', payload)

    assert response.status_code == 403


@pytest.mark.django_db
def test_conversation_group_update_fail_wrong_attributes(auth_client, create_user, create_group, add_user_to_group):
    host = create_user(username='testhost')
    client = auth_client(host)
    group = create_group(host=host, name='testgroup')

    user = create_user(username='testuser')
    add_user_to_group(user=user, group=group, is_moderator=False)
    
    payload = dict(last_message=datetime.strptime("1990-01-01", "%Y-%m-%d"), host=user.id)
    response = client.patch(f'/api/groups/{group.id}/', payload)

    group.refresh_from_db()

    assert response.status_code == 200
    assert group.last_message != payload['last_message']
    assert group.host == host


@pytest.mark.django_db
def test_conversation_group_delete(auth_client, create_user, create_group):
    host = create_user(username='testhost')
    client = auth_client(host)
    group = create_group(host=host, name='testgroup')

    response = client.delete(f'/api/groups/{group.id}/')

    assert response.status_code == 204
    with pytest.raises(ConversationGroup.DoesNotExist):
        group.refresh_from_db()


@pytest.mark.django_db
def test_conversation_group_delete_fail_moderator(auth_client, create_user, create_group, add_user_to_group):
    moderator = create_user(username='testmoderator')
    client = auth_client(moderator)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    add_user_to_group(user=moderator, group=group, is_moderator=True)

    response = client.delete(f'/api/groups/{group.id}/')

    assert response.status_code == 403


@pytest.mark.django_db
def test_conversation_group_delete_fail_regular_member(auth_client, create_user, create_group, add_user_to_group):
    user = create_user(username='testuser')
    client = auth_client(user)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    add_user_to_group(user=user, group=group, is_moderator=False)

    response = client.delete(f'/api/groups/{group.id}/')

    assert response.status_code == 403


@pytest.mark.django_db
def test_conversation_group_delete_fail_not_member(auth_client, create_user, create_group):
    user = create_user(username='testuser')
    client = auth_client(user)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')

    response = client.delete(f'/api/groups/{group.id}/')

    assert response.status_code == 403



