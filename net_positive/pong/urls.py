from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='pong-home'),
    path('play/', views.play, name='pong-play'),
    path('bot/', views.bot, name='pong-bot'),
    path('tour/', views.tour, name='pong-tour'),
    path('<str:training_session>/', views.wsbot, name='wsbot'),

]