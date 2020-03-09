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
  bally = court['bally']
  # {"bally": "10", "paddley": "20", "reward": "0"}
  data = {
    'up': SimpleBot.simple_bot(court),
  }
  return JsonResponse(data)

def tour(request, template='tournament.html'):
    return render(request, template, {})

def play(request):
    return HttpResponse('<h1> Pong Play </h1>')

def wsbot(request, training_session):
  return render(request, 'pong/wsbot.html', {
        'training_session': training_session,
    })

