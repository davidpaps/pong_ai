from django.urls import path
from . import views
from django.shortcuts import redirect

urlpatterns = [
    path('', lambda request: redirect('arcade/', permanent=True)),
    path('arcade/', views.arcade, name='arcade'),
    path('multiplayer/', views.multiplayer, name='multiplayer'),
    path('training/', views.training, name='training'),
]
