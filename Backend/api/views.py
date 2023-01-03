from django.shortcuts import render, get_object_or_404
from django.contrib.auth import login, logout
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.exceptions import PermissionDenied
from rest_framework.authtoken.models import Token
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework import mixins
from rest_framework import status
from rest_framework import permissions
from rest_framework import views
from rest_framework import generics

from base.models import User, ConversationGroup,  GroupMember, Message, Event
from base.serializers import UserSerializer, DetailedUserSerializer
from base.serializers import ConversationGroupSerializer, DetailedConversationGroupSerializer
from base.serializers import GroupMemberSerializer
from base.serializers import MessageSerializer
from base.serializers import EventSerializer

from .utils import IsMemberLinkSelf, UserAlreadyInGroup, IsNotGroupMember, IsSelf, IsHost, IsMember, IsModerator, IsAuthor, IsNotEventGroup, IsEventParticipant, routes
from .serializers import LoginSerializer, RegisterSerializer


@api_view(['GET'])
def get_routes(request):
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

        if self.action == 'groups':
            return ConversationGroupSerializer

        if self.action == 'events':
            return EventSerializer

        return DetailedUserSerializer
    

    def get_queryset(self):
        if self.action == 'groups':
            user_groups_ids = GroupMember.objects.filter(Q(user=self.kwargs['pk'])).values('group__id')
            print(GroupMember.objects.filter(Q(user=self.kwargs['pk'])))
            print(user_groups_ids)
            return ConversationGroup.objects.filter(id__in=user_groups_ids)

        if self.action == 'events':
            return Event.objects.filter(Q(participants__id=self.kwargs['pk']))

        return User.objects.all()


    def get_permissions(self):
        if self.action in ('list', 'destroy'):
            permission_classes = [permissions.IsAdminUser]
        elif self.action in ('partial_update', 'groups', 'events'):
            permission_classes = [permissions.IsAuthenticated, IsSelf]
        elif self.action == 'update':
            permission_classes = [permissions.IsAdminUser, IsSelf]
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]

    
    @action(methods=['get'], detail=True, url_path='groups')
    def groups(self, request, *agrs, **kwargs):
        groups = self.get_queryset()
        serializer = self.get_serializer(groups, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


    @action(methods=['get'], detail=True, url_path='events')
    def events(self, request, *agrs, **kwargs):
        events = self.get_queryset()
        serializer = self.get_serializer(events, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


    @action(methods=['get'], detail=False, url_path='self')
    def user_self(self, request, *agrs, **kwargs):
        serializer = self.get_serializer(request.user)

        return Response(serializer.data)
        

class ConversationGroupViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action in ('list', 'list_all_groups'):
            return ConversationGroupSerializer

        return DetailedConversationGroupSerializer


    def get_queryset(self):
        if self.action == 'list':
            return ConversationGroup.objects.filter(is_private=False)

        return ConversationGroup.objects.all()


    def get_permissions(self):
        if self.action == ('update', 'partial_update'):
            permission_classes = [permissions.IsAuthenticated, IsMember, IsModerator, IsNotEventGroup]
        elif self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsMember, IsModerator, IsHost, IsNotEventGroup]
        elif self.action == 'list_all_groups':
            permission_classes = [permissions.IsAdminUser]
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

        group_member_data = {
            'user': serializer.data['host'],
            'group': serializer.data['id'],
            'is_moderator': True
        }

        group_member_serializer = GroupMemberSerializer(data=group_member_data)
        group_member_serializer.is_valid(raise_exception=True)

        group_member_serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def perform_create(self, serializer):
        serializer.save(host=self.request.user, is_event_group=False)


    @action(methods=['get'], detail=False, url_path='all')
    def list_all_groups(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer, status=status.HTTP_200_OK)


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
            permission_classes = [permissions.IsAuthenticated, IsNotEventGroup, IsMember]
        elif self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsNotEventGroup, IsMember, IsModerator]
        elif self.action in ('update', 'partial_update'):
            permission_classes = [permissions.IsAuthenticated, IsNotEventGroup, IsMember, IsModerator, IsHost]
        else: #  self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsNotEventGroup, IsMember, IsModerator | IsMemberLinkSelf]

        return [permission() for permission in permission_classes]
        

    def create(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = request.data
        data['group'] = self.kwargs['group_pk']
        
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
        group = get_object_or_404(ConversationGroup, id=self.kwargs['group_pk'])
        serializer.save(author=self.request.user, group=group)


class EventViewSet(ModelViewSet):
    queryset = Event.objects.all()
    
    
    def get_serializer_class(self):
        if self.action == 'participants_list':
            return UserSerializer

        return EventSerializer


    def get_permissions(self):
        if self.action == ('partial_update', 'update', 'destroy'):
            permission_classes = [permissions.IsAuthenticated, IsHost]
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        queryset = self.get_queryset()
        event = queryset.get(id=serializer.data['id'])
        event.participants.add(request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def perform_create(self, serializer):
        serializer.save(host=self.request.user)

    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        event = self.get_object()
        group = event.group
        
        serializer = self.get_serializer(event, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if event.group is not None:
            group_data = {
                'name': request.data.get('name', group.name),
                'description': request.data.get('description', group.description)
            }

            group_serializer = DetailedConversationGroupSerializer(group, data=group_data, partial=partial)
            group_serializer.is_valid(raise_exception=True)
            group_serializer.save()

        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)


    def destroy(self, request, *args, **kwargs):
        group = self.get_object().group
        group.delete()

        return super().destroy(request, *args, **kwargs)


    
    @action(methods=['GET'], detail=True, url_path='participants')
    def participants_list(self, request, *args, **kwargs):
        event = self.get_object()
        participants = event.participants.all()

        serializer = self.get_serializer(participants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
    @action(methods=['GET'], detail=True)
    def join(self, request, *args, **kwargs):
        event = get_object_or_404(self.queryset, id=kwargs['pk'])

        if event.max_participants <= event.participants.count() and event.max_participants > 0:
            msg = 'User cannot join this event because it has reached its maximal participants capacity.'
            return Response(msg, status=status.HTTP_403_FORBIDDEN)

        event.participants.add(request.user)

        if event.group is not None:
            group_member_data = {
                'user': request.user,
                'group': event.group,
                'is_moderator': False
            }

            group_member_serializer = GroupMemberSerializer(data=group_member_data)
            group_member_serializer.is_valid(raise_exception=True)

            group_member_serializer.save()

        serializer = self.get_serializer(event, many=False)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)


    @action(methods=['GET'], detail=True)
    def leave(self, request, *args, **kwargs):
        event = get_object_or_404(self.queryset, id=kwargs['pk'])
        event.participants.remove(request.user)

        if event.group is not None:
            try:
                link = GroupMember.objects.get(Q(user=request.user) & Q(group=event.group))
                link.delete()
            except ObjectDoesNotExist:
                pass

        return Response(None, status=status.HTTP_202_ACCEPTED)


class EventGroupViewSet(GenericViewSet):
    serializer_class = DetailedConversationGroupSerializer

    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsHost]
        else:
            permission_classes = [permissions.IsAuthenticated, IsEventParticipant]

        return [permission() for permission in permission_classes]


    def create(self, request, *args, **kwargs):
        event = get_object_or_404(Event, id=self.kwargs['event_pk'])

        if event.group is not None:
            msg = 'Group for this event already exists.'
            return Response(msg, status=status.HTTP_403_FORBIDDEN)

        data = {
            'host': request.user,
            'name': event.name,
            'description': event.description,
            'is_private': True,
            'is_event_group': True
        }

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        for user in event.participants.all():
            event_participant_data = {
                'user': user,
                'group': serializer.data['id'],
                'is_moderator': False
            }

            if user == event.host:
                event_participant_data['is_moderator'] = True

            event_participant_serializer = GroupMemberSerializer(data=event_participant_data)
            event_participant_serializer.is_valid(raise_exception=True)
            event_participant_serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    
    @action(methods=['GET'], detail=False, url_path='group') # False detail because I do not want {lookup}
    def retrieve_group(self, request, *args, **kwargs):
        event = get_object_or_404(Event, id=self.kwargs['event_pk'])

        if event.group is not None:
            msg = 'This event does not have group assigned to it.'
            return Response(msg, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(event.group)

        return Response(serializer.data, status=status.HTTP_200_OK)
