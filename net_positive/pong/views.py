from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return HttpResponse('<h1> Pong Home </h1>')

def play(request):
    return HttpResponse('<h1> Pong Play </h3>')