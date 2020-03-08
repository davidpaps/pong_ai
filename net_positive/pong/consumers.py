from channels.generic.websocket import WebsocketConsumer
import json
from pong.models import SimpleBot

class PongConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        print(text_data)
        court_json = json.loads(text_data)["court"]
        print(court_json)
        bally = json.loads(court_json)["bally"]
        paddley = json.loads(court_json)["paddley"]
        reward = json.loads(court_json)["reward]
        move = SimpleBot.simple_bot_ws(bally, paddley, reward)

        self.send(text_data=json.dumps({
            'court': court,
            'move': move,
        }))