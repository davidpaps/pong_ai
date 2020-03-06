from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from pong.models import SimpleBot

def home(request, template='index.html'):
    return render(request, template, {})

def bot(request):
    bally = request.GET.get('bally')
    paddley = request.GET.get('paddley')
    court = {'bally': bally, 'paddley': paddley}
    data = {
      'up': SimpleBot.simple_bot(court),
    }
    return JsonResponse(data)

def play(request):
    return HttpResponse('<h1> Pong Play </h3>')
