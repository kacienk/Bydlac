from rest_framework.serializers import ModelSerializer
from .models import User, ConversationGroup


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'nickname', 
            'profile_image',
            'bio',
            'created'
        ]


class ConversationGroupSerializer(ModelSerializer):
    class Meta:
        model = ConversationGroup
        fields = [
            'id',
            'host',
            'name',
            'description',
            'updated',
            'created'
        ]
