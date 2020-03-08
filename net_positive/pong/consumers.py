from channels.generic.websocket import WebsocketConsumer
import json
from pong.models import SimpleBot

class PongConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        move = SimpleBot.simple_bot({'bally': '150', 'paddley': '120', 'reward': '0'})

        self.send(text_data=json.dumps({
            'message': message,
            'move': move,
        }))