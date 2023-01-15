from django.shortcuts import render, HttpResponse
from django.views.decorators.http import require_safe

@require_safe
def home(request):
    return HttpResponse('Nothing here! For API routes use "adress"/api/')
