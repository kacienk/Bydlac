import pytest

@pytest.mark.django_db
def test_group_messages_list(auth_client, create_user, create_group, create_message):
    user1 = create_user(username='testuser1')
    client = auth_client(user1)

    group = create_group(host=user1, name='testgroup')
    message1 = create_message(group=group, author=user1, body='test1')
    message2 = create_message(group=group, author=user1, body='test2')
    message3 = create_message(group=group, author=user1, body='test3')

    response = client.get(f'/api/groups/{group.id}/messages/')
    data = response.data
    
    assert response.status_code == 200
    assert len(data) == 3
    assert data[0]['author'] == user1.id
    assert data[1]['author'] == user1.id
    assert data[2]['author'] == user1.id
    assert data[0]['body'] == message1.body
    assert data[1]['body'] == message2.body
    assert data[2]['body'] == message3.body
