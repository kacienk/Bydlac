from django.urls import path
from . import views


urlpatterns = [
    path("", views.get_routes, name='routes'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),

    path("users/", views.UserListView.as_view(), name='users'),
    path("users/<int:pk>/update/", views.UserUpdateView.as_view(), name='update-user'),
    path("users/<int:pk>/delete/", views.UserDeleteView.as_view(), name='delete-user'),
    path("users/<int:pk>", views.UserRetrieveView.as_view(), name='user'),

    path("groups/", views.GroupListView.as_view(), name='groups'),
    path("groups/create/", views.GroupCreateView.as_view(), name='create-group'),
    path("groups/<int:pk>/update/", views.GroupUpdateView.as_view(), name='update-group'),
    path("groups/<int:pk>/delete/", views.GroupDeleteView.as_view(), name='delete-group'),
    path("groups/<int:pk>", views.GroupRetrieveView.as_view(), name='group'),
    path("groups/add-user/", views.AddUserToGroupView.as_view(), name='add-to-group'),
    path("groups/<int:group_id>/remove-user/<int:user_id>", views.RemoveUserFromGroup.as_view(), name='delete-from-group'),


]