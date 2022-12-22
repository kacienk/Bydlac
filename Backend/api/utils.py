from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from django.db.models import Q
from base.models import GroupMember, ConversationGroup

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

    def has_object_permission(self, request, view, obj):
        return obj == request.user


class IsHost(BasePermission):
    """
    User sending request is trying to delete group.
    """
    message = 'User sending request is not the host of the group they trying to delete.'

    def has_object_permission(self, request, view, obj):
        return ConversationGroup.objects.get(id=obj.id).host == request.user


class IsModerator(BasePermission):
    """
    User sending request is trying to modify group.
    """
    message = 'User sending request is not a moderator of the group they try to modify.'

    def has_object_permission(self, request, view, obj):
        try:
            return GroupMember.objects.get(Q(user=request.user) & Q(group=request.data.get('group_pk'))).is_moderator
        except ObjectDoesNotExist:
            message = 'User sending request is not a member of the group they try to modify.'
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