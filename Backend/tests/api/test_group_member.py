import pytest
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

from base.models import GroupMember
from base.serializers import GroupMemberSerializer


@pytest.mark.django_db
def test_group_member_list(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    user2 = create_user(username='testuser2')
    user3 = create_user(username='testuser3')

    group = create_group(host=user1, name='testgroup')
    add_user_to_group(user=user2, group=group)
    add_user_to_group(user=user3, group=group)

    response = client.get(f'/api/groups/{group.id}/members/')
    data = response.data
    data = sorted(data, key=lambda x: x.get('user'))

    assert response.status_code == 200, f'{response.data}'
    assert len(data) == 3
    assert data[0]['user'] == user1.id
    assert data[1]['user'] == user2.id
    assert data[2]['user'] == user3.id
    assert data[0]['username'] == user1.username
    assert data[1]['username'] == user2.username
    assert data[2]['username'] == user3.username
    assert data[0]['is_moderator'] == True
    assert data[1]['is_moderator'] == False
    assert data[2]['is_moderator'] == False


@pytest.mark.django_db
def test_group_member_list_fail_not_member(auth_client, create_user, create_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')

    response = client.get(f'/api/groups/{group.id}/members/')

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_group_member_create_host(auth_client, create_user, create_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')
    user2 = create_user(username='testuser2')

    payload = dict(group=group.id, user=user2.id)
    response = client.post(f'/api/groups/{group.id}/members/', payload)
    data = response.data

    members = GroupMember.objects.filter(Q(group=group))
    serializer = GroupMemberSerializer(members, many=True)

    assert response.status_code == 201, f'{response.data}'
    assert len(serializer.data) == 2
    assert data['user'] == user2.id
    assert data['group'] == group.id
    assert data['is_moderator'] == False
    try:
        GroupMember.objects.get(user=data['user'], group=data['group'])
    except ObjectDoesNotExist:
        assert False, 'User was not added.'


@pytest.mark.django_db
def test_group_member_create_moderator(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    add_user_to_group(group=group, user=user1, is_moderator=True)
    user2 = create_user(username='testuser2')

    payload = dict(group=group.id, user=user2.id)
    response = client.post(f'/api/groups/{group.id}/members/', payload)
    data = response.data

    members = GroupMember.objects.filter(Q(group=group))
    serializer = GroupMemberSerializer(members, many=True)

    assert response.status_code == 201, f'{response.data}'
    assert len(serializer.data) == 3
    assert data['user'] == user2.id
    assert data['group'] == group.id
    assert data['is_moderator'] == False
    try:
        GroupMember.objects.get(user=data['user'], group=data['group'])
    except ObjectDoesNotExist:
        assert False, 'User was not added.'


@pytest.mark.django_db
def test_group_member_create_fail_regular_member(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    add_user_to_group(group=group, user=user1, is_moderator=False)
    user2 = create_user(username='testuser2')

    payload = dict(group=group.id, user=user2.id)
    response = client.post(f'/api/groups/{group.id}/members/', payload)

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_group_member_create_fail_not_member(auth_client, create_user, create_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    user2 = create_user(username='testuser2')

    payload = dict(group=group.id, user=user2.id)
    response = client.post(f'/api/groups/{group.id}/members/', payload)

    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_group_member_delete_host(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')
    user2 = create_user(username='testuser2')
    link = add_user_to_group(group=group, user=user2)

    response = client.delete(f'/api/groups/{group.id}/members/{user2.id}/')
    
    assert response.status_code == 204, f'{response.data}'
    with pytest.raises(GroupMember.DoesNotExist):
        link.refresh_from_db()


@pytest.mark.django_db
def test_group_member_delete_moderator(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    add_user_to_group(group=group, user=user1, is_moderator=True)
    user2 = create_user(username='testuser2')
    link = add_user_to_group(group=group, user=user2)

    response = client.delete(f'/api/groups/{group.id}/members/{user2.id}/')
    
    assert response.status_code == 204, f'{response.data}'
    with pytest.raises(GroupMember.DoesNotExist):
        link.refresh_from_db()


@pytest.mark.django_db
def test_group_member_delete_self(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    link = add_user_to_group(group=group, user=user1, is_moderator=False)

    response = client.delete(f'/api/groups/{group.id}/members/{user1.id}/')
    
    assert response.status_code == 204, f'{response.data}'
    with pytest.raises(GroupMember.DoesNotExist):
        link.refresh_from_db()


@pytest.mark.django_db
def test_group_member_delete_fail_regular_member_not_self(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    add_user_to_group(group=group, user=user1, is_moderator=False)
    user2 = create_user(username='testuser2')
    link = add_user_to_group(group=group, user=user2)

    response = client.delete(f'/api/groups/{group.id}/members/{user2.id}/')
    
    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_group_member_delete_fail_not_member(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    user2 = create_user(username='testuser2')
    link = add_user_to_group(group=group, user=user2)

    response = client.delete(f'/api/groups/{group.id}/members/{user2.id}/')
    
    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_group_member_delete_fail_moderator_other_moderator(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    add_user_to_group(group=group, user=user1, is_moderator=True)
    user2 = create_user(username='testuser2')
    link = add_user_to_group(group=group, user=user2, is_moderator=True)

    response = client.delete(f'/api/groups/{group.id}/members/{user2.id}/')
    
    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_group_member_delete_fail_moderator_delete_host(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    add_user_to_group(group=group, user=user1, is_moderator=True)

    response = client.delete(f'/api/groups/{group.id}/members/{host.id}/')
    
    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_group_member_patch(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')
    user2 = create_user(username='testuser2')
    link = add_user_to_group(group=group, user=user2)

    response = client.patch(f'/api/groups/{group.id}/members/{user2.id}/', dict(is_moderator=True))

    link.refresh_from_db()
    
    assert response.status_code == 200, f'{response.data}'
    assert link.is_moderator == True


@pytest.mark.django_db
def test_group_member_patch_fail_not_host(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    host = create_user(username='testhost')
    group = create_group(host=host, name='testgroup')
    add_user_to_group(group=group, user=user1, is_moderator=True)
    user2 = create_user(username='testuser2')
    link = add_user_to_group(group=group, user=user2)

    response = client.patch(f'/api/groups/{group.id}/members/{user2.id}/', dict(is_moderator=True))
    
    assert response.status_code == 403, f'{response.data}'


@pytest.mark.django_db
def test_group_member_patch_fail_change_not_existing_link(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')

    response = client.patch(f'/api/groups/{group.id}/members/0/', dict(is_moderator=True))
    
    assert response.status_code == 404, f'{response.data}'


@pytest.mark.django_db
def test_group_member_patch_fail_is_event_group(auth_client, create_user, create_group, add_user_to_group):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup', is_event_group=True)
    user2 = create_user(username='testuser2')
    link = add_user_to_group(group=group, user=user2)

    response = client.patch(f'/api/groups/{group.id}/members/{user2.id}/', dict(is_moderator=True))
    
    assert response.status_code == 403, f'{response.data}'