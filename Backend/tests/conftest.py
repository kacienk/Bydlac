import pytest
import uuid
from rest_framework.test import APIClient

from base.models import User, ConversationGroup, Event, GroupMember, Message


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def test_password():
    return 'testpassword'


@pytest.fixture
def create_user(test_password):
    """
    Base user fixture. If username is not specified in kwargs it will be generated randomly.
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
    Base user fixture. If username is not specified in kwargs it will be generated randomly.
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


@pytest.fixture
def auth_user(client, test_password):
    """
    Authenticates a user. Expected user instance in args.
    """
    def authenticate_user(user):
        return client.post('/api/login/', dict(email=user.email, password=test_password))
    
    return authenticate_user


@pytest.fixture
def auth_client(client, auth_user):
    """
    Returns client authenticated with given user.
    """
    def authenticate_client(user):
        auth_response = auth_user(user)
        client.credentials(HTTP_AUTHORIZATION='Token ' + auth_response.data['token'])

        return client
    
    return authenticate_client


@pytest.fixture
def add_user_to_group():
    """
    Adds user to group. Expected user instance and group instance in kwargs.
    """
    def add(**kwargs):
        if 'user' not in kwargs:
            raise Exception('User instance not specified.')
        if 'group' not in kwargs:
            raise Exception('Group instance not specified.')

        return GroupMember.objects.create(**kwargs)

    return add


@pytest.fixture
def create_group(add_user_to_group):
    """
    Creates a conversation group. Expected host key in kwargs called host which is user instance.
    If name is not specified in kwargs it will be generated randomly
    """
    def create_conversation_group(**kwargs):
        if 'name' not in kwargs:
            kwargs['name'] = str(uuid.uuid4())
        if 'host' not in kwargs:
            raise Exception('Group host not specified.')

        group = ConversationGroup.objects.create(**kwargs)
        add_user_to_group(user=kwargs['host'], group=group, is_moderator=True)

        return group

    return create_conversation_group


@pytest.fixture
def add_user_to_event(add_user_to_group):
    """
    Adds user to event. Expected user instance and event instance in kwargs.
    """
    def add(**kwargs):
        if 'user' not in kwargs:
            raise Exception('Event instance not specified.')
        if 'event' not in kwargs:
            raise Exception('Group instance not specified.')

        user = kwargs['user']
        event = kwargs['event']
        if event.group:
            add_user_to_group(group=event.group, user=user)

        return event.participants.add(user)
        
    return add


@pytest.fixture
def create_event(add_user_to_event):
    """
    Creates an event. Expected host key in kwargs called host which is user instance.
    If name is not specified in kwargs it will be generated randomly
    """
    def make_event(**kwargs):
        if 'name' not in kwargs:
            kwargs['name'] = str(uuid.uuid4())
        if 'host' not in kwargs:
            raise Exception('Event host not specified.')

        event =  Event.objects.create(**kwargs)
        add_user_to_event(user=kwargs['host'], event=event)

        return event

    return make_event


@pytest.fixture
def create_message():
    """
    Creates a message. Expected in kwargs:
        author key which is user instance,
        group key, group instance,
        body key, string
    If body is not specified, then it is set to 'test'.
    Author user should be a member of the group.
    It is not checked, although testing situations in which author is not a member of the group is pointless.
    """
    def make_message(**kwargs):
        if 'author' not in kwargs:
            raise Exception('Message author not specified.')
        if 'group' not in kwargs:
            raise Exception('Message group not specified.')
        if 'body' not in kwargs:
            kwargs['body'] = 'test'
        
        return Message.objects.create(**kwargs)

    return make_message