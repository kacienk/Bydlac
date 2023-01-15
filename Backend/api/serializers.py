from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

from base.models import User, GroupMember


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(
        label='Email',
        required=True,
        write_only=True
    )

    password = serializers.CharField(
        label='Password',
        style={'input_type': 'password'},
        required=True,
        trim_whitespace=False,
        write_only=True
    )

    class Meta:
        model = User
        fields = ('email', 'password')


    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)

            if not user:
                msg = 'Access denied: wrong email or password'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            error_messages={'unique': 'A user is already registered with this adress'},
            validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(
        write_only=True, 
        required=True,
        style={'input_type': 'password'}, 
        validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email')
        extra_kwargs = {'username': {'required': True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
     
        user.set_password(validated_data['password'])
        user.save()

        return user


class GroupMemberListSerializer(serializers.Serializer):
    username = serializers.CharField()
    user = serializers.IntegerField()
    group = serializers.IntegerField()
    is_moderator = serializers.BooleanField()


class MessageListSerializer(serializers.Serializer):
    username = serializers.CharField()
    author = serializers.IntegerField()
    group = serializers.IntegerField()
    body = serializers.CharField()
    edited = serializers.DateTimeField()
    created = serializers.DateTimeField()
    is_location = serializers.BooleanField()