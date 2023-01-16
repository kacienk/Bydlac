from django.shortcuts import render, HttpResponse
from django.views.decorators.http import require_safe

from rest_framework import permissions
from rest_framework.decorators import permission_classes

@require_safe
@permission_classes([permissions.AllowAny])
def home(request):
    """
    View sent when senging get to /.
    """
    return HttpResponse('Nothing here! For API routes use "adress"/api/')
