from django.shortcuts import render, HttpResponse


def home(request):
    return HttpResponse('Nothing here! For API routse use "adress"/api/')
