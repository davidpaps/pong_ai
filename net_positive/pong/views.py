from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse


def arcade(request, template='arcade.html'):
  return render(request, template, {})

def multiplayer(request, template='multiplayer.html'):
  return render(request, template, {})

def training(request, template='training.html'):
  return render(request, template, {})

