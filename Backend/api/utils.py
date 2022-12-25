from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404

from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission

from base.models import Event, GroupMember, ConversationGroup, User

class IsNotGroupMember(PermissionDenied):
    default_detail = 'User is not member of the group'
    default_code = 'invalid'

    def __init__(self, detail=None, status_code=None):
        if detail:
            self.detail = detail
        else:
            self.detail = self.default_detail

        if status_code is not None:
            self.status_code = status_code


class IsNotModerator(PermissionDenied):
    default_detail = 'User requesting adding another user to the group is not moderator of the group'
    default_code = 'invalid'

    def __init__(self, detail=None, status_code=None):
        if detail:
            self.detail = detail
        else:
            self.detail = self.default_detail

        if status_code is not None:
            self.status_code = status_code


class UserAlreadyInGroup(PermissionDenied):
    default_detail = 'User already in group'
    default_code = 'invalid'

    def __init__(self, detail=None, status_code=None):
        if detail:
            self.detail = detail
        else:
            self.detail = self.default_detail

        if status_code is not None:
            self.status_code = status_code


class IsSelf(BasePermission):
    """
    User sending request is trying to receive object representing user.
    """
    message = 'User sending request is not represented by the object they are trying to receive.'

    def has_permission(self, request, view):
        try:
            return User.objects.get(id=view.kwargs['pk']) == request.user
        except ObjectDoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        return obj == request.user


class IsHost(BasePermission):
    """
    User sending request is trying to delete group.
    """
    message = 'User sending request is not the host of the group they trying to delete.'

    def has_object_permission(self, request, view, obj):
        try:
            return ConversationGroup.objects.get(id=obj.id).host == request.user
        except ObjectDoesNotExist:
            return False


class IsModerator(BasePermission):
    """
    User sending request is trying to modify group.
    """
    message = 'User sending request is not a moderator of the group they try to modify.'

    def has_object_permission(self, request, view, obj):
        try:
            return GroupMember.objects.get(Q(user=request.user) & Q(group=request.data.get('group_pk'))).is_moderator
        except ObjectDoesNotExist:
            return False


class IsMember(BasePermission):
    """
    User sending request is member.
    """
    message = 'User cannot look up members of group unless they are also a member'

    def has_permission(self, request, view):
        try:
            return GroupMember.objects.get(Q(user=request.user) & Q(group=view.kwargs['group_pk']))
        except ObjectDoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        try:
            return GroupMember.objects.get(Q(user=request.user) & Q(group=obj))
        except ObjectDoesNotExist:
            return False


class IsMemberLinkSelf(BasePermission):
    """
    User sending request is represented by this link.
    """
    message = 'User cannot remove other members of group unless they are moderator.'

    def has_object_permission(self, request, view, obj):
        return request.user == obj.user


class IsAuthor(BasePermission):
    message = 'User cannot change message unless they are its author.'

    def has_object_permission(self, request, view, obj):
        return request.user == obj.author


class IsNotEventGroup(BasePermission):
    """
    Is the group that is queried a group not attatched to an event.
    """
    msg = 'Group attatched to an event cannot be managed independently.'

    def has_permission(self, request, view):
        try:
            return not ConversationGroup.objects.get(id=view.kwargs['group_pk']).is_event_group
        except ObjectDoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        return not obj.is_event_group


class IsEventParticipant(BasePermission):
    """
    Is user performing action a participant of this event.
    """
    msg = 'User cannot retrieve group of an event that they do not participate in.'

    def has_permission(self, request, view):
        try:
            return request.user in Event.objects.get(id=view.kwargs['event_pk']).participants.all()
        except ObjectDoesNotExist:
            return False

    
    def has_object_permission(self, request, view, obj):
        try:
            return request.user in  Event.objects.get(id=view.kwargs['event_pk']).participants.all()
        except ObjectDoesNotExist:
            return False


routes = [
    # LOGING IN
    {
        'endpoint': '/login/',
        'method': 'POST',
        'description': 'Logs in user with data sent in post request',
        'permisson': 'Any'
    },
    {
        'endpoint': '/register/',
        'method': 'POST',
        'description': 'Registers user with data sent in post request',
        'permisson': 'Any'
    },
    {
        'endpoint': '/logout/',
        'method': 'GET',
        'description': 'Logs in user with data sent in post request',
        'permisson': 'Any'
    },

    # USERS
    {
        'endpoint': '/users',
        'method': 'GET',
        'description': 'Returns list of all registered users',
        'permisson': 'AdminUser'
        
    },
    {
        'endpoint': '/users/self',
        'method': 'GET',
        'description': 'Returns data of user with given token',
        'permisson': 'Authenticated'
        
    },
    {
        'endpoint': '/users/{pk}',
        'method': 'GET',
        'description': 'Returns user with given id',
        'permisson': 'Authenticated'
    },
    {
        'endpoint': '/users/{pk}',
        'method': 'PATCH',
        'description': 'Updates user bio and profile_image (Note: email and username cannot be changed once set)',
        'permisson': 'Authenticated, Self'
    },
    {
        'endpoint': '/users/{pk}',
        'method': 'DELETE',
        'description': 'Deletes user',
        'permisson': 'AdminUser'
    },
    {
        'endpoint': '/users/{pk}/groups',
        'method': 'GET',
        'description': 'Returns list of groups that user is member of',
        'permisson': 'Authenticated, Self'
    },
    {
        'endpoint': '/users/{pk}/events',
        'method': 'GET',
        'description': 'Returns list of events that user participates in.',
        'permisson': 'Authenticated, Self'
    },

    # GROUPS
    {
        'endpoint': '/groups',
        'method': 'GET',
        'description': 'Returns list of non-private groups',
        'permisson': 'Authenticated'
    },
    {
        'endpoint': '/groups/all',
        'method': 'GET',
        'description': 'Returns list of all groups',
        'permisson': 'AdminUser'
    },
    {
        'endpoint': '/groups/{pk}',
        'method': 'GET',
        'description': 'Returns group with given id',
        'permisson': 'Authenticated'
    },
    {
        'endpoint': '/groups/{pk}',
        'method': 'POST',
        'description': 'Creates new group with data sent in post request',
        'permisson': 'Authenticated'
    },
    {
        'endpoint': '/groups/{pk}',
        'method': 'PUT, PATCH',
        'description': 'Updates group\'s data',
        'permisson': 'Authenticated, Member, Moderator, NotEventGroup'
    },
    {
        'endpoint': '/groups/{pk}',
        'method': 'DELETE',
        'description': 'Deletes group',
        'permisson': 'Authenticated, Member, Moderator, Host, NotEventGroup'
    },

    # MEMBERS
    {
        'endpoint': '/groups/{group_pk}/members',
        'method': 'GET',
        'description': 'Returns list of group members',
        'permisson': 'Authenticated, Member, NotEventGroup'
    },
    {
        'endpoint': '/groups/{group_pk}/members', 
        'method': 'POST',
        'description': 'Adds user to the group with id equal to group_id',
        'permisson': 'Authenticated, Member, Moderator, NotEventGroup'
    },
    {
        'endpoint': '/groups/{group_pk}/members/{pk}',  
        'method': 'DELETE',
        'description': 'Removes user with id equal to {pk} to the group with id equal to {group_pk}',
        'permisson': 'Authenticated, Member, Moderator | MemberLinkSelf, NotEventGroup'
    },
    {
        'endpoint': '/groups/{group_pk}/members/{pk}', 
        'method': 'PUT, PATCH',
        'description': 'Changes moderator status of user with id equal to {pk} in the group with id equal to {group_pk}',
        'permisson': 'Authenticated, Member, Moderator, Host, NotEventGroup'
    },

    # MESSAGES
    {
        'endpoint': '/groups/{group_pk}/messages', 
        'method': 'GET',
        'description': 'Returns list of messages sent to group with id equal to, {group_pk}',
        'permisson': 'Authenticated, Member'
    },
    {
        'endpoint': '/groups/{group_pk}/messages', 
        'method': 'POST',
        'description': 'Sends message to the group with id equal to {group_pk}',
        'permisson': 'Authenticated, Member'
    },
    {
        'endpoint': '/groups/{group_pk}/messages/{pk}', 
        'method': 'GET',
        'description': 'Retrieves message with id equal to given {pk}',
        'permisson': 'Authenticated, Member'
    },
    {
        'endpoint': '/groups/{group_pk}/messages/{pk}', 
        'method': 'PUT, PATCH',
        'description': 'Updates message with id equal to given {pk}',
        'permisson': 'Authenticated, Member, Author'
    },
    {
        'endpoint': '/groups/{group_pk}/messages/{pk}', 
        'method': 'DELETE',
        'description': 'Deletes message with id equal to given {pk}',
        'permisson': 'Authenticated, Member, Author | Moderator'
    },

    #EVENTS
    {
        'endpoint': '/events', 
        'method': 'GET',
        'description': 'Gets list of all events',
        'permisson': 'Authenticated'
    },
    {
        'endpoint': '/events', 
        'method': 'POST',
        'description': 'Creates an event',
        'permisson': 'Authenticated'
    },
    {
        'endpoint': '/events/{pk}', 
        'method': 'GET',
        'description': 'Retreives an event with id equal to given {pk}',
        'permisson': 'Authenticated'
    },
    {
        'endpoint': '/events/{pk}', 
        'method': 'PUT, PATCH',
        'description': 'Updates an event with id equal to given {pk}',
        'permisson': 'Authenticated, Host'
    },
    {
        'endpoint': '/events/{pk}', 
        'method': 'DELETE',
        'description': 'Deletes an event with id equal to given {pk}',
        'permisson': 'Authenticated, Host'
    },
    {
        'endpoint': '/events/{pk}/join', 
        'method': 'GET',
        'description': 'User sending request joins event with id equall to {pk}, creates a link between the user and the event',
        'permisson': 'Authenticated'
    },
    {
        'endpoint': '/events/{pk}/leave', 
        'method': 'GET',
        'description': 'User sending request leaves event with id equall to {pk}, deletes a link between the user and the event',
        'permisson': 'Authenticated'
    },
    {
        'endpoint': '/events/{pk}/group', 
        'method': 'GET',
        'description': 'Retrieves data of a group of the event with id equall to {pk}',
        'permisson': 'Authenticated, EventParticipant'
    },
    {
        'endpoint': '/events/{pk}/group', 
        'method': 'POST',
        'description': 'Creates a group for the event with id equall to {pk}',
        'permisson': 'Authenticated, Host'
    },
    ]
 