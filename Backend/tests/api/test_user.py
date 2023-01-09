import pytest
from base.models import User
from base.serializers import UserSerializer


@pytest.mark.django_db
def test_register_user(client):
    payload = {
        'username': 'testuser',
        'password': 'testpassword',
        'password2': 'testpassword',
        'email': 'test@mail.com' 
    }

    response = client.post('/api/register/', payload)
    data = response.data

    assert response.status_code == 201, f'{response.data}'
    assert data['username'] == payload['username']
    assert data['email'] == payload['email']
    assert 'password' not in data


@pytest.mark.django_db
def test_login_user(client, create_user, test_password):
    username = 'testuser'
    email = username + '@mail.com'

    create_user(username=username)
    response = client.post('/api/login/', dict(email=email, password=test_password))

    assert response.status_code == 202, f'{response.data}'
    assert 'token' in response.data


@pytest.mark.django_db
def test_login_user_fail(client):
    response = client.post('/api/login/', dict(email='nobody@mail.com', password='notrightpassword'))

    assert response.status_code == 400


@pytest.mark.django_db
def test_users_list(client, create_superuser, create_user, auth_user):
    superuser = create_superuser(username='testuser')
    auth_response = auth_user(superuser)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

    create_user(username='testuser1')
    create_user(username='testuser2')
    create_user(username='testuser3')

    response = client.get('/api/users/')
    data = response.data

    all_users_serializer = UserSerializer(User.objects.all(), many=True)

    assert data == all_users_serializer.data


@pytest.mark.django_db
def test_user_list_fail_authenticated_not_admin(client, create_user, auth_user):
    user = create_user(username='testuser')
    auth_response = auth_user(user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

    response = client.get('/api/users/')

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_user_list_fail_not_authenticated(client):
    """
    Only test for unauthenticated access.
    """
    response = client.get('/api/users/')

    assert response.status_code == 401, f'{response.data}'


@pytest.mark.django_db
def test_user_self(client, create_user, auth_user):
    user = create_user(username='testuser')
    auth_response = auth_user(user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

    response = client.get('/api/users/self/')
    data = response.data

    assert response.status_code == 200, f'{response.data}'
    assert data['id'] == user.id
    assert data['username'] == user.username 
    assert 'password' not in data  


@pytest.mark.django_db
def test_user_retrieve(client, create_user, auth_user):
    user1 = create_user(username='testuser1')
    user2 = create_user(username='testuser2')
    auth_response = auth_user(user1)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

    response = client.get(f'/api/users/{user2.id}/')
    data = response.data

    assert response.status_code == 200, f'{response.data}'
    assert data['id'] == user2.id
    assert data['username'] == user2.username
    assert 'password' not in data


@pytest.mark.django_db
def test_user_retrieve_fail_bad_id(client, create_user, auth_user):
    user1 = create_user(username='testuser1')
    auth_response = auth_user(user1)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

    response = client.get(f'/api/users/-1/')

    assert response.status_code == 404, f'{response.data}'


@pytest.mark.django_db
def test_user_patch(client, create_user, auth_user):
    user = create_user(username='testuser')
    auth_response = auth_user(user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])
    bio = 'Test updated bio'

    client.patch(f'/api/users/{user.id}/', dict(bio=bio))

    response = client.get('/api/users/self/')
    data = response.data
    user.refresh_from_db()

    assert response.status_code == 200, f'{response.data}'
    assert data['bio'] == bio
    assert user.bio == bio
    assert data['id'] == user.id
    assert data['username'] == user.username 
    assert 'password' not in data


@pytest.mark.django_db
def test_user_patch_fail_patch_user_other_than_self(client, create_user, auth_user):
    user1 = create_user(username='testuser1')
    auth_response = auth_user(user1)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])
    user2 = create_user(username='testuser2')
    bio = 'Test updated bio'

    response = client.patch(f'/api/users/{user2.id}/', dict(bio=bio))

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_user_delete(client, create_user, create_superuser, auth_user):
    superuser = create_superuser(username='testuser')
    auth_response = auth_user(superuser)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])
    user = create_user(username='testuser')

    response = client.delete(f'/api/users/{user.id}/')

    assert response.status_code == 204, f'{response.data}'
    with pytest.raises(User.DoesNotExist):
        user.refresh_from_db()


@pytest.mark.django_db
def test_user_delete_fail_not_admin(client, create_user, auth_user):
    user1 = create_user(username='testuser1')
    auth_response = auth_user(user1)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])
    user2 = create_user(username='testuser2')

    response = client.delete(f'/api/users/{user2.id}/')

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_user_groups(client, create_user, auth_user, create_group):
    user = create_user(username='testuser')
    auth_response = auth_user(user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])
    group1 = create_group(host=user, name='group1')
    group2 = create_group(host=user, name='group2')

    response = client.get(f'/api/users/{user.id}/groups/')
    data = response.data
    data = sorted(data, key=lambda x: x.get('id'))

    assert response.status_code == 200, f'{response.data}'
    assert len(data) == 2
    assert data[0].get('id') == group1.id
    assert data[1].get('id') == group2.id
    assert data[0].get('name') == group1.name
    assert data[1].get('name') == group2.name

    
@pytest.mark.django_db
def test_user_groups_user_not_in_any_group(client, create_user, auth_user):
    user = create_user(username='testuser')
    auth_response = auth_user(user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

    response = client.get(f'/api/users/{user.id}/groups/')
    data = response.data

    assert response.status_code == 200, f'{response.data}'
    assert len(data) == 0


@pytest.mark.django_db
def test_user_groups_check_not_self_groups(client, create_user, auth_user, create_group):
    user1 = create_user(username='testuser')
    auth_response = auth_user(user1)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

    user2 = create_user(username='testuser2')
    group1 = create_group(host=user2, name='testgroup1')
    group2 = create_group(host=user2, name='testgroup2')

    response = client.get(f'/api/users/{user2.id}/groups/')

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_user_events(client, create_user, auth_user, create_event):
    user = create_user(username='testuser')
    auth_response = auth_user(user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])
    event1 = create_event(host=user, name='testevent1')
    event2 = create_event(host=user, name='testevent2')

    response = client.get(f'/api/users/{user.id}/events/')
    data = response.data
    print(data)

    assert response.status_code == 200, f'{response.data}'
    assert len(data) == 2
    assert data[0].get('id') == event1.id
    assert data[0].get('name') == event1.name
    assert data[1].get('id') == event2.id
    assert data[1].get('name') == event2.name


@pytest.mark.django_db
def test_user_events_user_not_in_any_event(client, create_user, auth_user):
    user = create_user(username='testuser')
    auth_response = auth_user(user)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

    response = client.get(f'/api/users/{user.id}/events/')
    data = response.data

    assert response.status_code == 200, f'{response.data}'
    assert len(data) == 0


@pytest.mark.django_db
def test_user_events_check_not_self_events(client, create_user, auth_user, create_event):
    user1 = create_user(username='testuser')
    auth_response = auth_user(user1)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

    user2 = create_user(username='testuser2')
    event1 = create_event(host=user2, name='event1')
    event2 = create_event(host=user2, name='event2')

    response = client.get(f'/api/users/{user2.id}/groups/')

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_user_from_username(client, create_user, auth_user):
    user1 = create_user(username='testuser')
    auth_response = auth_user(user1)
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

    user2 = create_user(username='testuser2')
    response = client.get(f'/api/users/from-username/?username={user2.username}')
    data = response.data

    assert response.status_code == 200, f'{response.data}'
    assert data['id'] == user2.id


