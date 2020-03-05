from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from pong.models import SimpleBot

def home(request, template='index.html'):
    return render(request, template, {})

def bot(request):

    data = {
      'up': SimpleBot.simple_bot(),
    }
    return JsonResponse(data)

def play(request):
    return HttpResponse('<h1> Pong Play </h3>')
