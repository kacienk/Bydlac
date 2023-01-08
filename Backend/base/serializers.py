from rest_framework.serializers import ModelSerializer
from .models import User, ConversationGroup, GroupMember, Message, Event


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'username',
        ]


class DetailedUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',  
            'username', 
            'profile_image',
            'bio',
            'created'
        ]


    def update(self, instance, validated_data):
        instance.profile_image = validated_data.get('profile_image', instance.profile_image)
        instance.bio = validated_data.get('bio', instance.bio)

        instance.save()

        return instance


class ConversationGroupSerializer(ModelSerializer):
    class Meta:
        model = ConversationGroup
        fields = [
            'id',
            'host',
            'name',
            'is_private',
            'last_message',
            'created'
        ]


class DetailedConversationGroupSerializer(ModelSerializer):
    class Meta:
        model = ConversationGroup
        fields = [
            'id',
            'host',
            'name',
            'description',
            'is_private',
            'last_message',
            'created'
        ]
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.is_private = validated_data.get('is_private', instance.is_private)

        instance.save()

        return instance


class GroupMemberSerializer(ModelSerializer):
    class Meta:
        model = GroupMember
        fields = [
            'user',
            'group',
            'is_moderator',
        ]
        

    def update(self, instance, validated_data):
        instance.is_moderator = validated_data.get('is_moderator', instance.is_moderator)

        instance.save()

        return instance


class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


    def update(self, instance, validated_data):
        instance.body = validated_data.get('body', instance.body)

        return instance


class EventSerializer(ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'id',
            'host',
            'name',
            'description',
            'max_participants',
            'location',
            'expires',
            'created',
        ]

    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.max_participants = validated_data.get('max_participants', instance.max_participants)
        instance.location = validated_data.get('location', instance.location)
        instance.expires = validated_data.get('expires', instance.expires)

        return instance