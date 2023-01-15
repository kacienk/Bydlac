class NoHostException(Exception):
    """
    Raised in tests when event host or conversation group host was not specified.
    """
    pass


class NoUserException(Exception):
    """
    Raised in tests when user was not specified.
    """
    pass


class NoConversationGroupException(Exception):
    """
    Raised in tests when conversation group was not specified.
    """
    pass


class NoEventException(Exception):
    """
    Raised in tests when event was not specified.
    """
    pass


class NoAuthorException(Exception):
    """
    Raised in tests when author of the message was not specified.
    """
    pass

