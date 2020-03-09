from django.db import models
import json
from datetime import datetime
import numpy as np
import pickle

class SimpleBot(models.Model):
    @classmethod
    def simple_bot(request, court):


      if int(court["bally"]) <= int(court["paddley"]):
        print(True)
        return True
      else:
        print(False)
        return False

    @classmethod
    def simple_bot_ws(request, bally, paddley, reward):
      if int(bally) <= int(paddley):
        print(True)
        return True
      else:
        print(False)
        return False

class AndrejBot(models.Model):
    prev_x = None # used in computing the difference frame
    model = pickle.load(open('pong/save.p', 'rb'))

    @classmethod
    def andrej_bot(request, pixels):
      D = 80 * 80
      # preprocess the observation, set input to network to be difference image
      cur_x = AndrejBot.prepro(pixels)
      x = cur_x - prev_x if prev_x is not None else np.zeros(D)
      prev_x = cur_x

      # forward the policy network and sample an action from the returned probability
      aprob, h = AndrejBot.policy_forward(x)
      move_up = True if 0.5 < aprob else False #take the action most likely to yield the best result
      return move_up

    @classmethod
    def sigmoid(x): 
      return 1.0 / (1.0 + np.exp(-x)) # sigmoid "squashing" function to interval [0,1]
      
    @classmethod
    def prepro(request, I):
      """ prepro 210x160x3 uint8 frame into 6400 (80x80) 1D float vector """
      I = I[::4,::4,0] # downsample by factor of 4
      # I[I == 144] = 0 # erase background (background type 1)
      # I[I == 109] = 0 # erase background (background type 2)
      I[I != 0] = 1 # everything else (paddles, ball) just set to 1
      return I.astype(np.float).ravel()

    @classmethod
    def policy_forward(x):
      h = np.dot(model['W1'], x)
      h[h<0] = 0 # ReLU nonlinearity
      logp = np.dot(model['W2'], h)
      p = AndrejBot.sigmoid(logp)
      return p, h # return probability of taking action 2, and hidden state


