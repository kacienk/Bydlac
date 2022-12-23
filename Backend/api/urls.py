from django.urls import path, include
from rest_framework_nested import routers
from . import views

router = routers.SimpleRouter()
router.register(r'users', views.UserViewSet, basename='users')
router.register(r'groups', views.ConversationGroupViewSet, basename='groups')
router.register(r'events', views.EventViewSet, basename='events')

members_router = routers.NestedSimpleRouter(router, r'groups', lookup='group')
members_router.register(r'members', views.GroupMemberViewSet, basename='groups-members')

message_router = routers.NestedSimpleRouter(router, r'groups', lookup='group')
message_router.register(r'messages', views.MessageViewSet, basename='groups-messages')


urlpatterns = [
    path(r"", views.get_routes, name='routes'),
    path(r'login/', views.LoginView.as_view(), name='login'),
    path(r'register/', views.RegisterView.as_view(), name='register'),
    path(r'logout/', views.LogoutView.as_view(), name='logout'),

    path(r'', include(router.urls)),

    path(r'', include(members_router.urls)),

    path(r'', include(message_router.urls)),
]
