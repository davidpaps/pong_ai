from channels.generic.websocket import WebsocketConsumer
import json
from pong.models import SimpleBot
from pong.models import AndrejBot
from pong.models import AndrejBotTraining

class PongConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        court_json = json.loads(text_data)["court"]
        bally = json.loads(court_json)["bally"]
        paddley = json.loads(court_json)["paddley"]
        reward = json.loads(court_json)["reward"]
        image = json.loads(text_data)["image"]
        done = json.loads(text_data)["done"]
        # move = SimpleBot.simple_bot_ws(bally, paddley, reward)
        # move = AndrejBot.andrej_bot(image)
        
        move = AndrejBotTraining.andrej_training(image, reward, done)

        self.send(text_data=json.dumps({
            'move': move,
        }))
