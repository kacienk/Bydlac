import pytest

from django.core.exceptions import ObjectDoesNotExist

from base.models import Message


@pytest.mark.django_db
def test_message_list(auth_client, create_user, create_group, create_message):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')
    message1 = create_message(group=group, author=user1, body='test1')
    message2 = create_message(group=group, author=user1, body='test2')
    message3 = create_message(group=group, author=user1, body='test3')

    response = client.get(f'/api/groups/{group.id}/messages/')
    data = response.data
    
    assert response.status_code == 200, f'{response.data}'
    assert len(data) == 3
    assert data[0]['author'] == user1.id
    assert data[1]['author'] == user1.id
    assert data[2]['author'] == user1.id
    assert data[0]['body'] == message1.body
    assert data[1]['body'] == message2.body
    assert data[2]['body'] == message3.body


@pytest.mark.django_db
def test_message_list_fail_not_member(auth_client, create_user, create_group, create_message):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    create_message(group=group, author=host, body='test1')
    create_message(group=group, author=host, body='test2')
    create_message(group=group, author=host, body='test3')

    response = client.get(f'/api/groups/{group.id}/messages/')
    
    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_message_create(auth_client, create_user, create_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')
    payload = dict(group=group.id, author=user1.id, body='test')
    response = client.post(f'/api/groups/{group.id}/messages/', payload)
    data = response.data
    
    assert response.status_code == 201, f'{response.data}' 
    assert data['group'] == group.id
    assert data['author'] == user1.id
    assert data['body'] == payload['body']
    try:
        Message.objects.get(id=data['id'])
    except ObjectDoesNotExist:
        assert False, 'Message was not created.'


@pytest.mark.django_db
def test_message_create_fail_not_member(auth_client, create_user, create_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    payload = dict(group=group.id, author=user1.id, body='test')
    response = client.post(f'/api/groups/{group.id}/messages/', payload)
    
    assert response.status_code == 403, f'{response.data}' 


@pytest.mark.django_db
def test_message_retrieve(auth_client, create_user, create_group, create_message):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')
    message1 = create_message(group=group, author=user1, body='test1')

    response = client.get(f'/api/groups/{group.id}/messages/{message1.id}/')
    data = response.data
    
    assert response.status_code == 200, f'{response.data}'
    assert data['author'] == user1.id
    assert data['body'] == message1.body


@pytest.mark.django_db
def test_message_retrieve_fail_not_member(auth_client, create_user, create_group, create_message):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    message1 = create_message(group=group, author=user1, body='test1')
    response = client.get(f'/api/groups/{group.id}/messages/{message1.id}/')
    
    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_message_retrieve_fail_wrong_id(auth_client, create_user, create_group, create_message):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')
    response = client.get(f'/api/groups/{group.id}/messages/0/')
    
    assert response.status_code == 404


@pytest.mark.django_db
def test_message_update(auth_client, create_user, create_group, create_message):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')
    message1 = create_message(group=group, author=user1, body='test1')

    payload = dict(body='newtest')
    response = client.patch(f'/api/groups/{group.id}/messages/{message1.id}/', payload)
    data = response.data
    
    print(message1)
    message1.refresh_from_db()

    assert response.status_code == 200, f'{response.data}'
    assert data['author'] == user1.id
    assert data['body'] == message1.body
    assert payload['body'] == message1.body


@pytest.mark.django_db
def test_message_update_fail_not_author(auth_client, create_user, create_group, create_message, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')
    user2 = create_user(username='testuser2')
    add_user_to_group(group=group, user=user2)
    message1 = create_message(group=group, author=user2, body='test1')

    payload = dict(body='newtest')
    response = client.patch(f'/api/groups/{group.id}/messages/{message1.id}/', payload)

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_message_delete_author(auth_client, create_user, create_group, create_message):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')
    message1 = create_message(group=group, author=user1, body='test1')

    response = client.delete(f'/api/groups/{group.id}/messages/{message1.id}/')

    assert response.status_code == 204, f'{response.data}'
    with pytest.raises(Message.DoesNotExist):
            message1.refresh_from_db()


@pytest.mark.django_db
def test_message_delete_moderator(auth_client, create_user, create_group, create_message, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    message1 = create_message(group=group, author=host, body='test1')
    add_user_to_group(group=group, user=user1, is_moderator=True)

    response = client.delete(f'/api/groups/{group.id}/messages/{message1.id}/')

    assert response.status_code == 204, f'{response.data}'
    with pytest.raises(Message.DoesNotExist):
            message1.refresh_from_db()


@pytest.mark.django_db
def test_message_delete_fail_not_moderator_not_author(auth_client, create_user, create_group, create_message, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    message1 = create_message(group=group, author=host, body='test1')
    add_user_to_group(group=group, user=user1, is_moderator=False)

    response = client.delete(f'/api/groups/{group.id}/messages/{message1.id}/')

    assert response.status_code == 403, f'{response.data}'