from django.contrib import admin
from .models import User, ConversationGroup, GroupMember, Message, Event

admin.site.register(User)
admin.site.register(ConversationGroup)
admin.site.register(GroupMember)
admin.site.register(Message)
admin.site.register(Event)