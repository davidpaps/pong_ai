from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/pong/(?P<training_session>\w+)/$', consumers.PongConsumer),
]
