from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from pong.models import SimpleBot


def home(request, template='index.html'):
    return render(request, template, {})

def bot(request):
    bally = request.GET.get('bally')
    paddley = request.GET.get('paddley')
    reward = request.GET.get('reward')
    court = {'bally': bally, 'paddley': paddley, 'reward': reward}
    data = {
      'up': SimpleBot.simple_bot(court),
    }
    return JsonResponse(data)

def play(request):
    return HttpResponse('<h1> Pong Play </h3>')

def wsbot(request, training_session):
 
  return render(request, 'pong/wsbot.html', {
        'training_session': training_session,
    })
