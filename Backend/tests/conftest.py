import pytest
import uuid
from rest_framework.test import APIClient

from base.models import User


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def test_password():
    return 'testpassword'


@pytest.fixture
def create_user(test_password):
    """
    Base user fixture. If username is not specified it will be generated randomly.
    """
    def make_user(**kwargs):
        kwargs['password'] = test_password

        if 'username' not in kwargs:
            kwargs['username'] = str(uuid.uuid4())
        
        kwargs['email'] = kwargs['username'] + '@mail.com'

        return User.objects.create_user(**kwargs)
        

    return make_user


@pytest.fixture
def create_superuser(test_password):
    """
    Base user fixture. If username is not specified it will be generated randomly.
    '_admin' postfix will be added to the username.
    """
    def make_superuser(**kwargs):
        kwargs['password'] = test_password

        if 'username' not in kwargs:
            kwargs['username'] = str(uuid.uuid4())
        
        kwargs['username'] = kwargs['username'] + '_admin'
        kwargs['email'] = kwargs['username'] + '@mail.com'

        return User.objects.create_superuser(**kwargs)


    return make_superuser


