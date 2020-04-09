from channels.generic.websocket import WebsocketConsumer
import json
from pong.models import PerfectBot
from pong.models import NonPerfectBot
from pong.models import AndrejBot
from pong.models import AndrejBotBallOnly
from pong.models import AndrejBotTraining
from pong.models import FaultyBot
from pong.models import Junior

class PongConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        court_json = json.loads(text_data)["court"]
        bot = json.loads(text_data)["bot"]
        training_opponent = json.loads(text_data)["trainingopponent"]
        
        if training_opponent == "true":
            self.training_opponent(court_json)
        else:
            if bot == "student":
                self.student(text_data)

            if bot == "steffi-graph":
                self.steffi_graph(court_json)
            
            if bot == "nodevak-djokovic":
                self.nodevak_djokovic(court_json)

            if bot == "rl-federer":
                self.rl_federer(text_data)
            
            if bot == "andrai-agassi":
                self.andrai_agassi(court_json)

            if bot == "bjorn-cyborg":
                self.bjorn_cyborg(text_data)
        
    def training_opponent(self, court_json):
        ball_y = json.loads(court_json)["bally"]
        paddle_y = json.loads(court_json)["paddley"]
        move_up = NonPerfectBot.get_move(ball_y, paddle_y)
        self.send(text_data=json.dumps({
            'moveup': move_up,
            'playerID': 0
        }))

    def student(self, text_data):
        done = json.loads(text_data)["done"]
        reward = json.loads(text_data)["reward"]
        image = json.loads(text_data)["image"]
        image = self.reverse_string_compression(image)
        image = list(image)
        move_up = AndrejBotTraining.get_move(image, reward, done)
        self.send(text_data=json.dumps({
            'moveup': move_up,
            'playerID': 1
        }))

    def steffi_graph(self, court_json):
        ball_y = json.loads(court_json)["bally"]
        paddle_y = json.loads(court_json)["paddley"]
        move_up = PerfectBot.get_move(ball_y, paddle_y)
        self.send(text_data=json.dumps({
            'moveup': move_up,
            'playerID': 1
        }))

    def nodevak_djokovic(self, court_json):
        ball_y = json.loads(court_json)["bally"]
        paddle_y = json.loads(court_json)["paddley"]
        move_up = NonPerfectBot.get_move(ball_y, paddle_y)
        self.send(text_data=json.dumps({
            'moveup': move_up,
            'playerID': 1
        }))

    def rl_federer(self, text_data):
        image = json.loads(text_data)["image"]
        image = self.reverse_string_compression(image)
        image = list(image)
        move_up = AndrejBot.get_move(image)
        self.send(text_data=json.dumps({
            'moveup': move_up,
            'playerID': 1 
        }))

    def andrai_agassi(self, court_json):
        ball_y = json.loads(court_json)["bally"]
        paddle_y = json.loads(court_json)["paddley"]
        move_up = FaultyBot.get_move(ball_y, paddle_y)
        self.send(text_data=json.dumps({
            'moveup': move_up,
            'playerID': 1 
        }))

    def bjorn_cyborg(self, text_data):
        image = json.loads(text_data)["image"]
        image = self.reverse_string_compression(image)
        image = list(image)
        move_up = Junior.get_move(image)
        self.send(text_data=json.dumps({
            'moveup': move_up,
            'playerID': 1 
        }))

    def reverse_string_compression (self, image):
        image = image.replace('v', 'wwwwwwwwwwwwwwwwwwww')
        image = image.replace('w', '00000000000000000000000000000000000000000000000000000000000000000000000000000000')
        image = image.replace('x', '0000000000000000000000000000000000000000')
        image = image.replace('y', '00000000000000000000')
        image = image.replace('z', '0000000000')
        image = image.replace('a', '1111')
        return image



        
        
          
        

