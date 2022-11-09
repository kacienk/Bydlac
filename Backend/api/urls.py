from django.urls import path
from . import views


urlpatterns = [
    path("", views.get_routes, name='routes'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),

    path("users/", views.get_users, name='users'),
    path("users/register/", views.create_user, name='create-user'),
    path("users/<int:pk>/update/", views.update_user, name='update-user'),
    path("users/<int:pk>/delete/", views.delete_user, name='delete-user'),
    path("users/<int:pk>", views.get_user, name='user'),

    path("groups/", views.get_users, name='groups'),
    path("groups/create/", views.create_group, name='create-group'),
    path("groups/<int:pk>/update/", views.update_group, name='update-group'),
    path("groups/<int:pk>/delete/", views.delete_group, name='delete-group'),
    path("groups/<int:pk>", views.get_group, name='group'),


]