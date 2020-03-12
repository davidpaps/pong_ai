from channels.generic.websocket import WebsocketConsumer
import json
from pong.models import SimpleBot
from pong.models import AndrejBot
from pong.models import AndrejBotTraining
from datetime import datetime
import numpy as np

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
        done = json.loads(text_data)["done"]
        bot = json.loads(text_data)["bot"]
        trainingopponent = json.loads(text_data)["trainingopponent"]
        # print('load data')
        # print(datetime.now())
        image = json.loads(text_data)["image"]
        # print('decode b64')
        # print(datetime.now())
        # image = base64.b64decode(image)
        # print('decode ascii')
        # print(datetime.now())
        # image = image.decode('ascii')
        image = image.replace('w', '00000000000000000000000000000000000000000000000000000000000000000000000000000000')
        image = image.replace('x', '0000000000000000000000000000000000000000')
        image = image.replace('y', '00000000000000000000')
        image = image.replace('z', '0000000000')
        # print('split')
        # print(datetime.now())
        image = list(image)
      
        # print(image)
        # print(type(image))
        # print('send to model')
        # print(datetime.now()) 
        
        if trainingopponent == "true":
          bot = "steffi-graph"
          move = SimpleBot.simple_bot_ws(bally, paddley)
          self.send(text_data=json.dumps({
          'move': move,
          'trainingopponent': trainingopponent
          }))
        else:
          if bot == "student":
              move = AndrejBotTraining.andrej_training(image, reward, done)
              self.send(text_data=json.dumps({
              'move': move,
              'trainingopponent': trainingopponent
              }))

          if bot == "steffi-graph":
            move = SimpleBot.simple_bot_ws(bally, paddley)
            self.send(text_data=json.dumps({
            'move': move,
            'trainingopponent': trainingopponent
            }))

          if bot == "rl-federer":
            move = AndrejBot.andrej_bot(image)
            self.send(text_data=json.dumps({
            'move': move,
            'trainingopponent': trainingopponent 
            }))
        
          
        

