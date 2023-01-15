from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404

from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission

from base.models import Event, GroupMember, ConversationGroup, User

class IsNotGroupMemberException(PermissionDenied):
    default_detail = 'User is not member of the group'
    default_code = 'invalid'

    def __init__(self, detail=None, status_code=None):
        if detail:
            self.detail = detail
        else:
            self.detail = self.default_detail

        if status_code is not None:
            self.status_code = status_code


class UserAlreadyInGroupException(PermissionDenied):
    default_detail = 'User already in group'
    default_code = 'invalid'

    def __init__(self, detail=None, status_code=None):
        if detail:
            self.detail = detail
        else:
            self.detail = self.default_detail

        if status_code is not None:
            self.status_code = status_code


class EventGroupException(PermissionDenied):
    default_detail = 'You cannot update nor delete event group directly'
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


class IsConversationGroupHost(BasePermission):
    """
    User sending request is trying to delete group.
    """
    message = 'User sending request is not the host of the group.'

    def has_permission(self, request, view):
        group_id = view.kwargs.get('group_pk') or view.kwargs.get('pk')

        if not group_id:
            return False

        try:
            return ConversationGroup.objects.get(id=group_id).host == request.user
        except ObjectDoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        try:
            if isinstance(obj, ConversationGroup):
                return obj.host == request.user
        except ObjectDoesNotExist:
            return False

        return self.has_permission(request, view)


class IsEventHost(BasePermission):
    """
    User sending request is trying to delete group.
    """
    message = 'User sending request is not the host of the event.'

    def has_permission(self, request, view):
        event_id = view.kwargs.get('event_pk') or view.kwargs.get('pk')

        if not event_id:
            return False

        try:
            return Event.objects.get(id=event_id).host == request.user
        except ObjectDoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        try:
            if isinstance(obj, Event):
                return obj.host == request.user
        except ObjectDoesNotExist:
            return False

        return self.has_permission(request, view)


class IsModerator(BasePermission):
    """
    User sending request is trying to modify group.
    """
    message = 'User sending request is not a moderator of the group they try to modify.'

    def has_permission(self, request, view):
        group_id = view.kwargs.get('group_pk') or view.kwargs.get('pk')

        if not group_id:
            return False

        try:
            group = ConversationGroup.objects.get(id=group_id)
            return GroupMember.objects.get(user=request.user, group=group).is_moderator
        except ObjectDoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        try:
            if isinstance(obj, ConversationGroup):
                return GroupMember.objects.get(user=request.user, group=obj).is_moderator
        except ObjectDoesNotExist:
            return False

        return self.has_permission(request, view)


class IsMember(BasePermission):
    """
    User sending request is member.
    """
    message = 'User cannot look up members of group unless they are also a member'

    def has_permission(self, request, view):
        group_id = view.kwargs.get('group_pk') or view.kwargs.get('pk')

        if not group_id:
            return False

        try:
            group = ConversationGroup.objects.get(id=group_id)
            GroupMember.objects.get(user=request.user, group=group)
            return True
        except ObjectDoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, ConversationGroup):
            try:
                GroupMember.objects.get(user=request.user, group=obj)
                return True
            except ObjectDoesNotExist:
                return False

        return self.has_permission(request, view)


class IsPublic(BasePermission):
    """
    Group for which permission is requested is public.
    """

    message = "Group is private"

    def has_object_permission(self, request, view, obj):
        return not obj.is_private


class IsMemberLinkSelf(BasePermission):
    """
    The link between group and user is representing user sending request.
    """
    message = 'User cannot remove other members of group unless they are moderator.'

    def has_permission(self, request, view):
        group_id = view.kwargs.get('group_pk') 
        user_id = view.kwargs.get('pk')

        if not group_id or not user_id:
            return False

        try:
            group = ConversationGroup.objects.get(id=group_id)
            return GroupMember.objects.get(user=user_id, group=group).user == request.user
        except ObjectDoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        return request.user == obj.user


class IsAuthor(BasePermission):
    message = 'User cannot change message unless they are its author.'

    def has_object_permission(self, request, view, obj):
        return request.user == obj.author


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