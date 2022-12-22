from django.shortcuts import render, get_object_or_404
from django.contrib.auth import login, logout
from django.db.models import Q, Subquery
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.authtoken.models import Token
from rest_framework.viewsets import ViewSet, GenericViewSet, ModelViewSet
from rest_framework import mixins
from rest_framework import status
from rest_framework import permissions
from rest_framework import views
from rest_framework import generics

from .utils import IsMemberLinkSelf, IsNotModerator, UserAlreadyInGroup, IsNotGroupMember, IsSelf, IsHost, IsMember, IsModerator, IsAuthor

from base.models import User, ConversationGroup,  GroupMember, Message
from base.serializers import UserSerializer, DetailedUserSerializer
from base.serializers import ConversationGroupSerializer, DetailedConversationGroupSerializer
from base.serializers import GroupMemberSerializer
from base.serializers import MessageSerializer
from .serializers import LoginSerializer, RegisterSerializer


@api_view(['GET'])
def get_routes(request):
    routes = [
        # LOGING IN
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
            'Endpoint': '/login/',
            'method': 'POST',
            'body': None,
            'description': 'Logs in user with data sent in post request, permisson: Any'
        },
        {

            'Endpoint': '/logout/',
            'method': 'GET',
            'body': None,
            'description': 'Logs in user with data sent in post request, permisson: Any'
        },

        # USERS
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
            'description': 'Returns user with given id, permisson: Authenticated'
        },
        {
            'Endpoint': '/users/id/update/',
            'method': 'PUT, PATCH',
            'body': None,
            'description': 'Updates user bio and profile_image (Note: email and username cannot be changed once set), permisson: Authenticated'
        },
        {
            'Endpoint': '/users/id/delete/',
            'method': 'POST',
            'body': None,
            'description': 'Deletes user, permisson: AdminUser'
        },

        # GROUPS
        {
            'Endpoint': '/groups/',
            'method': 'GET',
            'body': None,
            'description': 'Returns list of non-private groups, permisson: Authenticated'
        },
        {
            'Endpoint': '/groups/all',
            'method': 'GET',
            'body': None,
            'description': 'Returns list of all groups, permisson: AdminUser'
        },
        {
            'Endpoint': '/groups/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns group with given id, permisson: Authenticated'
        },
        {
            'Endpoint': '/groups/create',
            'method': 'POST',
            'body': None,
            'description': 'Creates new group with data sent in post request, permisson: Authenticated'
        },
        {
            'Endpoint': '/groups/id/update',
            'method': 'PUT, PATCH',
            'body': None,
            'description': 'Updates group\'s data, permisson: Authenticated'
        },
        {
            'Endpoint': '/groups/id/delete',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes group, permisson: Authenticated'
        },
        {
            'Endpoint': '/groups/id/members',
            'method': 'GET',
            'body': None,
            'description': 'Returns list of group members, permisson: Authenticated'
        },
        {
            'Endpoint': '/groups/group_id/add-user/user_id', # not yet decided 
            'method': 'POST',
            'body': None,
            'description': 'Adds user with id equal to user_id to the group with id equal to group_id, permisson: Authenticated'
        },
        {
            'Endpoint': '/groups/group_id/remove-user/user_id',  
            'method': 'DELETE',
            'body': None,
            'description': 'Removes user with id equal to user_id to the group with id equal to group_id, permisson: Authenticated'
        },
        {
            'Endpoint': '/groups/group_id/change-moderator/user_id', 
            'method': 'PUT, PATCH',
            'body': None,
            'description': 'Changes moderator status of user with id equal to user_id to the group with id equal to group_id, permisson: Authenticated'
        },

        # MESSAGES
        {
            'Endpoint': '/groups/group_id/messages/send', 
            'method': 'POST',
            'body': None,
            'description': 'Sends message to the group with id equal to group_id, permisson: Authenticated'
        },
        {
            'Endpoint': '/groups/group_id/messages/update/message_id', 
            'method': 'PUT, PATCH',
            'body': None,
            'description': 'Updates message with given message_id, permisson: Authenticated'
        },
        {
            'Endpoint': '/groups/group_id/messages/delete/message_id', 
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes message with given message_id, permisson: Authenticated'
        },
        {
            'Endpoint': '/groups/group_id/messages', 
            'method': 'GET',
            'body': None,
            'description': 'Gets all messages sent to group with given group_id, permisson: Authenticated'
        },

        #EVENTS
        {
            'Endpoint': '/events', 
            'method': 'GET',
            'body': None,
            'description': 'Gets list of all events, permisson: Authenticated'
        },
        {
            'Endpoint': '/events/id', 
            'method': 'GET',
            'body': None,
            'description': 'Gets retreives event of given id, permisson: Authenticated'
        },
        {
            'Endpoint': '/events/id/create', 
            'method': 'POST',
            'body': None,
            'description': 'Creates an event, permisson: Authenticated'
        },
        {
            'Endpoint': '/events/id/update', 
            'method': 'PUT, PATCH',
            'body': None,
            'description': 'Updates an event, permisson: Authenticated'
        },
        {
            'Endpoint': '/events/id/delete', 
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes an event, permisson: Authenticated'
        },
        {
            'Endpoint': '/events/id/join', 
            'method': 'GET',
            'body': None,
            'description': 'User sending request joins event, creates a link between the user and the event, permisson: Authenticated'
        },
        {
            'Endpoint': '/events/id/leave', 
            'method': 'GET',
            'body': None,
            'description': 'User sending request leavs event, deletes a link between the user and the event, permisson: Authenticated'
        },
        {
            'Endpoint': '/events/id/group', 
            'method': 'GET',
            'body': None,
            'description': 'Retrieves data of a group of the event, permisson: Authenticated'
        },
        {
            'Endpoint': '/events/id/add-group', 
            'method': 'POST',
            'body': None,
            'description': 'Creates a group for the event, permisson: Authenticated'
        },
        {
            'Endpoint': '/events/id/remove-group', 
            'method': 'DELETE',
            'body': None,
            'description': 'Removes a group of the event, permisson: Authenticated'
        },
        {
            'Endpoint': '/events/id/update-group', 
            'method': 'PUT, PATCH',
            'body': None,
            'description': 'Removes a group of the event, permisson: Authenticated'
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

        token, create = Token.objects.get_or_create(user=user)

        context = {'token': token.key}
        return Response(context, status=status.HTTP_202_ACCEPTED)


class LogoutView(views.APIView):
    permission_classes = [permissions.AllowAny]


    def get(self, request, format=None):
        logout(request)
        return Response(None, status=status.HTTP_202_ACCEPTED)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class UserViewSet(GenericViewSet,
                  mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin):
    queryset = User.objects.all()


    def get_serializer_class(self):
        if self.action == 'list':
            return UserSerializer

        return DetailedUserSerializer


    def get_permissions(self):
        if self.action == ('list', 'destroy'):
            permission_classes = [permissions.IsAdminUser]
        elif self.action == 'partial_update':
            permission_classes = [permissions.IsAuthenticated, IsSelf]
        elif self.action == 'update':
            permission_classes = [permissions.IsAdminUser, IsSelf]
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]


class ConversationGroupViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action == 'list':
            return ConversationGroupSerializer

        return DetailedConversationGroupSerializer


    def get_queryset(self):
        if self.action == 'list':
            return ConversationGroup.objects.filter(is_private=False)

        return ConversationGroup.objects.all()


    def get_permissions(self):
        if self.action == ('update', 'partial_update'):
            permission_classes = [permissions.IsAuthenticated, IsMember, IsModerator]
        elif self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsMember, IsModerator, IsHost]
        else:
            # Here might slight change in logic might be necessary.
            # Maybe another permission that looks like 'IsMember | IsPublic' should be added.
            # We'll see in tests.
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]


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


class AllGroupListView(generics.ListAPIView):
    queryset = ConversationGroup.objects.all()
    serializer_class = ConversationGroupSerializer
    permission_classes = [permissions.IsAdminUser]


class GroupMemberViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action == 'list':
            return UserSerializer

        return GroupMemberSerializer


    def get_queryset(self):
        group_pk = self.kwargs['group_pk']

        if self.action == 'list':
            group_members = GroupMember.objects.filter(Q(group=group_pk)).values('user__id')

            return User.objects.filter(id__in=group_members)

        return GroupMember.objects.filter(group=group_pk)


    def get_permissions(self):
        if self.action in ('list', 'retreive'):
            permission_classes = [permissions.IsAuthenticated, IsMember]
        elif self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsMember, IsModerator]
        elif self.action in ('update', 'partial_update'):
            permission_classes = [permissions.IsAuthenticated, IsMember, IsModerator, IsHost]
        else: #  self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsMember, IsModerator | IsMemberLinkSelf]

        return [permission() for permission in permission_classes]
        

    def create(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = request.data
        data['group'] = self.kwargs['group_id']
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        # Checking if user is not member already
        try:
            if queryset.get(Q(user=serializer.data['user']) & Q(group=serializer.data['group'])):
                raise UserAlreadyInGroup()
        except ObjectDoesNotExist:
            pass                

        return super().create(request, *args, **kwargs)
    

    def update(self, request, *args, **kwargs):
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
            link_to_be_updated = queryset.get(Q(user=serializer.data['user']) & Q(group=serializer.data['group']))
        except ObjectDoesNotExist:
            msg = 'User to change moderator status is not a member of the group'
            raise IsNotGroupMember(msg)

        if link_to_be_updated.user == group.host:
            msg = 'Host\'s moderator status cannot be changed'
            raise PermissionDenied(msg)

        self.kwargs['pk'] = link_to_be_updated.id
        return super().update(request, *args, **kwargs)


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

        if link_to_be_deleted.is_moderator and user != group.host:
            msg = 'Only host of the group can remove moderators from the group'
            raise PermissionDenied(msg)


        self.kwargs['pk'] = link_to_be_deleted.id
        return super().delete(request, *args, **kwargs)


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        return Message.objects.filter(group=self.kwargs['group_pk'])


    def get_permissions(self):
        if self.action in ('list', 'retreive', 'create'):
            permission_classes = [permissions.IsAuthenticated, IsMember]
        elif self.action in ('update', 'partial_update'):
            permission_classes = [permissions.IsAuthenticated, IsMember, IsAuthor]
        else: #  self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsMember, IsModerator | IsAuthor]

        return [permission() for permission in permission_classes]


    def perform_create(self, serializer):
        serializer.save(author=self.request.user, group=self.kwargs['group_pk'])