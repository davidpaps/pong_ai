from channels.generic.websocket import WebsocketConsumer
import json
from pong.models import SimpleBot
from pong.models import AndrejBot

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
        
        image_array = [int(i) for i in image]
        print(image_array)
        # print(type(image_array))
        # print(image_array)
        # move = SimpleBot.simple_bot_ws(bally, paddley, reward)
        move = AndrejBot.andrej_bot(image_array)
        
        self.send(text_data=json.dumps({
            'move': move,
        }))
