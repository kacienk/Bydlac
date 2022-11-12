from rest_framework.serializers import ModelSerializer
from .models import User, ConversationGroup, GroupMember


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'username',
            'created'
        ]


class DetailedUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
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
            'updated',
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
            'updated',
            'created'
        ]


class GroupMemberSerializer(ModelSerializer):
    class Meta:
        model = GroupMember
        fields = [
            'user',
            'group',
            'is_moderator',
        ]