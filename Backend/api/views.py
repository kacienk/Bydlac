from django.shortcuts import render
from django.contrib.auth import login
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from rest_framework import permissions
from rest_framework import views
from rest_framework import generics

from .utils import IsNotModerator, UserAlreadyInGroup, IsNotGroupMember

from base.models import User, ConversationGroup,  GroupMember
from base.serializers import UserSerializer, DetailedUserSerializer
from base.serializers import ConversationGroupSerializer, DetailedConversationGroupSerializer
from base.serializers import GroupMemberSerializer
from .serializers import LoginSerializer, RegisterSerializer


@api_view(['GET'])
def get_routes(request):
    routes = [
        {
            'Endpoint': '/login/',
            'method': 'POST',
            'body': None,
            'description': 'Logs in user with data sent in post request, permisson: Any'
        },
        {
            'Endpoint': '/register/',
            'method': 'POST',
            'body': None,
            'description': 'Registers user with data sent in post request, permisson: Any'
        },
        {
            'Endpoint': '/users/',
            'method': 'GET',
            'body': None,
            'description': 'Returns list of all registered users, permisson: AdminUser'
        },
        {
            'Endpoint': '/users/id/',
            'method': 'GET',
            'body': None,
            'description': 'Returns list of all registered users, permisson: Authenticated'
        },
        {
            'Endpoint': '/users/id/update/',
            'method': 'PUT, PATCH',
            'body': None,
            'description': 'Updates user bio and profile_image (Note: email and username cannot be changed once set), permisson: Authenticated'
        },
        {
            'Endpoint': '/users/id/delete/',
            'method': 'GET',
            'body': None,
            'description': 'Deletes user, permisson: AdminUser'
        },
    ]

    return Response(routes)


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = LoginSerializer(data=self.request.data, context={ 'request': self.request })
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        login(request, user)

        return Response(None, status=status.HTTP_202_ACCEPTED)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class UserRetrieveView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = DetailedUserSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = DetailedUserSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = DetailedUserSerializer
    permission_classes = [permissions.IsAdminUser]


class GroupListView(generics.ListAPIView):
    queryset = ConversationGroup.objects.all()
    serializer_class = ConversationGroupSerializer
    permission_classes = [permissions.IsAdminUser]


class GroupRetrieveView(generics.RetrieveAPIView):
    queryset = ConversationGroup.objects.all()
    serializer_class = DetailedConversationGroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupCreateView(generics.CreateAPIView):
    queryset = ConversationGroup.objects.all()
    serializer_class = DetailedConversationGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        group_participant_data = {
            'user': serializer.data['host'],
            'group': serializer.data['id'],
            'is_moderator': True
        }

        group_participant_serializer = GroupMemberSerializer(data=group_participant_data)
        group_participant_serializer.is_valid(raise_exception=True)

        group_participant_serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class GroupUpdateView(generics.UpdateAPIView):
    queryset = ConversationGroup.objects.all()
    serializer_class = DetailedConversationGroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupDeleteView(generics.DestroyAPIView):
    queryset = ConversationGroup.objects.all()
    serializer_class = DetailedConversationGroupSerializer
    permission_classes = [permissions.IsAdminUser]


class AddUserToGroupView(generics.CreateAPIView):
    queryset = GroupMember.objects.all()
    serializer_class = GroupMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = self.request.user
        queryset = self.get_queryset()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Checking if user requesting adding is member and moderator of the group
        try:
            if not queryset.get(Q(user=user) & Q(group=serializer.data['group'])).is_moderator:
                msg = 'User requesting adding another user to the group is not moderator of the group'
                raise IsNotModerator(msg, status_code=status.HTTP_403_FORBIDDEN)
        except ObjectDoesNotExist:
            msg = 'User requesting adding another user to the group is not in the group himself'
            raise IsNotGroupMember(msg)

        # Checking if user is not member already
        try:
            if queryset.get(Q(user=serializer.data['user']) & Q(group=serializer.data['group'])):
                raise UserAlreadyInGroup()
        except ObjectDoesNotExist:
            pass                

        return super().create(request, *args, **kwargs)


class RemoveUserFromGroup(generics.DestroyAPIView):
    queryset = GroupMember.objects.all()
    serializer_class = GroupMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = self.request.user
        queryset = self.get_queryset()
        data= {'user': kwargs['user_id'], 'group': kwargs['group_id']}

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        try:
            link_to_be_deleted = queryset.get(Q(user=serializer.data['user']) & Q(group=serializer.data['group']))
        except ObjectDoesNotExist:
            msg = 'User to be removed is not a member of the group'
            raise IsNotGroupMember(msg)

        group_host = ConversationGroup.objects.get(id=serializer.data['group'])

        if link_to_be_deleted.user == group_host:
            msg = 'Host cannot be removed from the group'
            raise PermissionDenied(msg)

        # If user requests to delete himself from the group he should be able to do that, unless he is the host
        if user != link_to_be_deleted.user:
            # Checking if user requesting removing is member and moderator of the group
            try:
                if not queryset.get(Q(user=user) & Q(group=serializer.data['group'])).is_moderator:
                    msg = 'User requesting removing another user to the group is not moderator of the group'
                    raise IsNotModerator(msg, status_code=status.HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                msg = 'User requesting removing another user to the group is not in the group himself'
                raise IsNotGroupMember(msg)

            if link_to_be_deleted.is_moderator and user != group_host:
                msg = 'Only host of the group can remove moderators from the group'
                raise PermissionDenied(msg)


        kwargs['pk'] = link_to_be_deleted.id
        return super().delete(request, *args, **kwargs)



