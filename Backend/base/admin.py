from django.contrib import admin
from .models import User, ConversationGroup, GroupParticipant, Message, Event

admin.site.register(User)
admin.site.register(ConversationGroup)
admin.site.register(GroupParticipant)
admin.site.register(Message)
admin.site.register(Event)