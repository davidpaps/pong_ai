from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='pong-home'),
    path('play/', views.play, name='pong-play'),
]