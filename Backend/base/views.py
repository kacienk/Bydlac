from django.shortcuts import render, HttpResponse


def home(request):
    return HttpResponse('Nothing here! For API routes use "adress"/api/')
