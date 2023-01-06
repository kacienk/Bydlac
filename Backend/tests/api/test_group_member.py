import pytest


@pytest.mark.django_db
def test_group_member_list(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    user2 = create_user(username='testuser2')
    user3 = create_user(username='testuser3')

    group = create_group(host=user1, name='testgroup')
    add_user_to_group(user=user2, group=group)
    add_user_to_group(user=user3, group=group)

    client