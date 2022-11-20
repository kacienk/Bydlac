from django.urls import path
from . import views


urlpatterns = [
    path("", views.get_routes, name='routes'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    path("users/", views.UserListView.as_view(), name='users'),
    path("users/<int:pk>/update/", views.UserUpdateView.as_view(), name='update-user'),
    path("users/<int:pk>/delete/", views.UserDeleteView.as_view(), name='delete-user'),
    path("users/<int:pk>", views.UserRetrieveView.as_view(), name='user'),

    path("groups/", views.GroupNonPrivateListView.as_view(), name='non-private-groups'),
    path("groups/all", views.GroupListView.as_view(), name='groups'),
    path("groups/create/", views.GroupCreateView.as_view(), name='create-group'),
    path("groups/<int:pk>/update/", views.GroupUpdateView.as_view(), name='update-group'),
    path("groups/<int:pk>/delete/", views.GroupDeleteView.as_view(), name='delete-group'),
    path("groups/<int:group_id>/members/", views.GetGroupMembersView.as_view(), name='get-members'),
    path("groups/<int:pk>", views.GroupRetrieveView.as_view(), name='group'),
    
    path("groups/<int:group_id>/add-user/<int:user_id>", views.AddUserToGroupView.as_view(), name='add-to-group'),
    path("groups/<int:group_id>/remove-user/<int:user_id>", views.RemoveUserFromGroupView.as_view(), name='delete-from-group'),
    path("groups/<int:group_id>/change-moderator/<int:user_id>/", views.GroupChangeModeratorStatusView.as_view(), name='group-change-moderator'),

    path("groups/<int:group_id>/messages/send/", views.MessageCreateView.as_view(), name='send-message'),
    path("groups/<int:group_id>/messages/update/<int:pk>/", views.MessageUpdateView.as_view(), name='update-message'),
    path("groups/<int:group_id>/messages/delete/<int:pk>", views.MessageDeleteView.as_view(), name='delete-message'),
    path("groups/<int:group_id>/messages/", views.MessageListView.as_view(), name='get-messages'),
]