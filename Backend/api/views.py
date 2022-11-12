from django.shortcuts import render
from django.contrib.auth import login
from django.db.models import Q, Subquery
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from rest_framework import permissions
from rest_framework import views
from rest_framework import generics

from .utils import IsNotModerator, UserAlreadyInGroup, IsNotGroupMember

from base.models import User, ConversationGroup,  GroupMember, Message
from base.serializers import UserSerializer, DetailedUserSerializer
from base.serializers import ConversationGroupSerializer, DetailedConversationGroupSerializer
from base.serializers import GroupMemberSerializer
from base.serializers import MessageSerializer
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

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)

class GroupUpdateView(generics.UpdateAPIView):
    queryset = ConversationGroup.objects.all()
    serializer_class = DetailedConversationGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = self.request.user
        group = self.get_object()

        try:
            if not GroupMember.get(Q(user=user) & Q(group=group)).is_moderator:
                msg = 'User requesting updating group is not moderator of the group'
                raise IsNotModerator(msg, status_code=status.HTTP_403_FORBIDDEN)
        except ObjectDoesNotExist:
            msg = 'User requesting updating group is not in the group'
            raise IsNotGroupMember(msg)

        return super().update(request, *args, **kwargs)

class GroupDeleteView(generics.DestroyAPIView):
    queryset = ConversationGroup.objects.all()
    serializer_class = DetailedConversationGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = self.request.user
        group = self.get_object()

        if user != group.host:
            msg = 'Only group host can delete group'
            raise PermissionDenied(msg)

        return super().delete(request, *args, **kwargs)


class GetGroupMembersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        group_id = self.kwargs['group_id']

        try:
            _ = GroupMember.objects.get(Q(user=user) & Q(group=group_id))
        except ObjectDoesNotExist:
            if ConversationGroup.objects.get(id=group_id).is_private:
                msg = 'User cannot look up members of private group unless they are also a member'
                raise IsNotGroupMember(msg)

        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        group_id = self.kwargs['group_id']

        group_members = GroupMember.objects.filter(Q(group=group_id)).values('user__id')
        queryset = self.queryset.filter(id__in=group_members)

        return queryset 


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


class RemoveUserFromGroupView(generics.DestroyAPIView):
    queryset = GroupMember.objects.all()
    serializer_class = GroupMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = self.request.user
        queryset = self.get_queryset()
        data= {'user': kwargs['user_id'], 'group': kwargs['group_id']}

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        group = ConversationGroup.objects.get(id=serializer.data['group'])

        try:
            link_to_be_deleted = queryset.get(Q(user=serializer.data['user']) & Q(group=serializer.data['group']))
        except ObjectDoesNotExist:
            msg = 'User to be removed is not a member of the group'
            raise IsNotGroupMember(msg)

        if link_to_be_deleted.user == group.host:
            msg = 'Host cannot be removed from the group'
            raise PermissionDenied(msg)

        # If user requests to delete himself from the group he should be able to do that, unless they are the host
        if user != link_to_be_deleted.user:
            # Checking if user requesting removing is member and moderator of the group
            try:
                if not queryset.get(Q(user=user) & Q(group=serializer.data['group'])).is_moderator:
                    msg = 'User requesting removing another user to the group is not moderator of the group'
                    raise IsNotModerator(msg, status_code=status.HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                msg = 'User requesting removing another user to the group is not in the group himself'
                raise IsNotGroupMember(msg)

            if link_to_be_deleted.is_moderator and user != group.host:
                msg = 'Only host of the group can remove moderators from the group'
                raise PermissionDenied(msg)


        self.kwargs['pk'] = link_to_be_deleted.id
        return super().delete(request, *args, **kwargs)


class GroupChangeModeratorStatusView(generics.UpdateAPIView):
    queryset = GroupMember.objects.all()
    serializer_class = GroupMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = self.request.user
        queryset = self.get_queryset()
        data= {
            'user': kwargs['user_id'], 
            'group': kwargs['group_id'], 
            'is_moderator': request.data.get('is_moderator', False)
        }

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        group = ConversationGroup.objects.get(id=serializer.data['group'])

        try:
            link_to_be_deleted = queryset.get(Q(user=serializer.data['user']) & Q(group=serializer.data['group']))
        except ObjectDoesNotExist:
            msg = 'User to change moderator status is not a member of the group'
            raise IsNotGroupMember(msg)

        if link_to_be_deleted.user == group.host:
            msg = 'Host\'s moderator status cannot be changed'
            raise PermissionDenied(msg)

        # Only host can change moderator status
        if user != group.host:
            msg = 'Only host of the group can change moderator status'
            raise PermissionDenied(msg)


        self.kwargs['pk'] = link_to_be_deleted.id
        return super().update(request, *args, **kwargs)


class MessageListView(generics.ListAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        group_id = self.kwargs['group_id']

        try:
            _ = GroupMember.objects.get(Q(user=user) & Q(group=group_id))
        except ObjectDoesNotExist:
            msg = 'User cannot get messages unless they are member of the group'
            raise IsNotGroupMember(msg)

        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        group_id = self.kwargs['group_id']
        queryset = self.queryset.filter(Q(group=group_id))

        return queryset


class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = self.request.user
        group_id = kwargs['group_id']

        try:
            _ = GroupMember.objects.get(Q(user=user) & Q(group=group_id))
        except ObjectDoesNotExist:
            msg = 'User cannot send message unless they are member of the group'
            raise IsNotGroupMember(msg)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        group = ConversationGroup.objects.get(id=self.kwargs['group_id'])
        serializer.save(author=self.request.user, group=group)


class MessageUpdateView(generics.UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = self.request.user
        message = self.get_object()

        if message.author != user:
            msg = "User cannot update message unless they are its author"
            raise PermissionDenied(msg)

        return super().update(request, *args, **kwargs)


class MessageDeleteView(generics.DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = self.request.user
        group_id = self.kwargs['group_id']
        message = self.get_object()

        # Checking if user that wants to delete message is author or moderator
        try:
            if not GroupMember.get(Q(user=user) & Q(group=group_id)).is_moderator or message.author != user:
                msg = 'User requesting deleting message is not its author nor moderator of the group'
                raise IsNotModerator(msg, status_code=status.HTTP_403_FORBIDDEN)
        except ObjectDoesNotExist:
            msg = 'User requesting deleting message is not in the group where message has been sent'
            raise IsNotGroupMember(msg)

        return super().delete(request, *args, **kwargs)
