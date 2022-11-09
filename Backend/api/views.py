from django.shortcuts import render
from django.contrib.auth import login

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework import permissions
from rest_framework import views
from rest_framework import generics

from base.models import User, ConversationGroup
from base.serializers import UserSerializer, ConversationGroupSerializer
from .serializers import LoginSerializer, RegisterSerializer



@api_view(['GET'])
def get_routes(request):
    routes = [

    ]

    return Response(routes)


class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = LoginSerializer(data=self.request.data, context={ 'request': self.request })
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        login(request, user)

        return Response(None, status=status.HTTP_202_ACCEPTED)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def get_user(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['POST'])
def create_user(request):
    data = request.user
    user = User.objects.create(
        email = data['email'],
        username = data['username'],
        profile_image = data['profile_image'],
        bio = data['bio'],
        password=data['password']
    )
    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['PUT'])
def update_user(request, pk):
    data = request.data
    user = User.objects.get(id=pk)
    serializer = UserSerializer(instance=user, data=data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
def delete_user(request, pk):
    user = User.objects.get(id=pk)
    user.delete()

    return Response('User was deleted')


@api_view(['GET'])
def get_groups():
    groups = ConversationGroup.objects.all()
    serializer = ConversationGroupSerializer(groups, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def get_group(request, pk):
    group = ConversationGroup.objects.get(id=pk)
    serializer = ConversationGroupSerializer(group, many=False)

    return Response(serializer.data)


@api_view(['POST'])
def create_group(request):
    data = request.group
    group = ConversationGroup.objects.create(
        host=data['host'],
        name=data['name'],
        description = data['description']
    )
    serializer = ConversationGroupSerializer(group, many=False)

    return Response(serializer.data)


@api_view(['PUT'])
def update_group(request, pk):
    data = request.data
    group = ConversationGroup.objects.get(id=pk)
    serializer = ConversationGroupSerializer(instance=group, data=data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
def delete_group(request, pk):
    group = ConversationGroup.objects.get(id=pk)
    group.delete()

    return Response('ConversationGroup was deleted')
