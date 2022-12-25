import pytest
from rest_framework.test import APIClient


client = APIClient()



@pytest.mark.django_db
def test_register_user():
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
def test_user_login():
    payload = {
        'username': 'testuser',
        'password': 'testpassword',
        'password2': 'testpassword',
        'email': 'test@mail.com' 
    }

    client.post('/api/register/', payload)
    response = client.post('/api/login/', dict(email='test@mail.com', password='testpassword'))

    assert response.status_code == 202


@pytest.mark.django_db
def test_user_login_fail():
    response = client.post('/api/login/', dict(email='nikt@mail.com', password='notrightpassword'))

    assert response.status_code == 400