import pytest


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

    assert data['username'] == payload['username']
    assert data['email'] == payload['email']
    assert 'password' not in data


@pytest.mark.django_db
def test_user_login(client, create_user, test_password):
    username = 'testuser'
    email = username + '@mail.com'

    create_user(username='testuser')
    response = client.post('/api/login/', dict(email=email, password=test_password))

    assert response.status_code == 202


@pytest.mark.django_db
def test_user_login_fail(client):
    response = client.post('/api/login/', dict(email='nobody@mail.com', password='notrightpassword'))

    assert response.status_code == 400


