from rest_framework.exceptions import PermissionDenied
from rest_framework import status


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