from django.db import models
import json
from datetime import datetime
import numpy as np
import pickle
import csv
from pathlib import Path
import cv2

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
    count = 0

    def __init__(self):
      self.prev_x = None
      self.model = pickle.load(open('pong/save.p', 'rb'))
      self.count = 0

    @classmethod
    def andrej_bot(self, pixels):
      D = 80 * 80
      # preprocess the observation, set input to network to be difference image
      cur_x = AndrejBot.prepro(pixels)
    
      x = cur_x - self.prev_x if self.prev_x is not None else np.zeros(D)
      self.prev_x = cur_x

      # forward the policy network and sample an action from the returned probability
      aprob, h = AndrejBot.policy_forward(x)
      print(aprob)
      move_up = True if 0.5 < aprob else False #take the action most likely to yield the best result
      return move_up

    @classmethod
    def sigmoid(request, x): 
      return 1.0 / (1.0 + np.exp(-x)) # sigmoid "squashing" function to interval [0,1]
      
    @classmethod
    def prepro(self, I):
      """ prepro 210x160x3 uint8 frame into 6400 (80x80) 1D float vector """
      # I = I[::4,::4,0] # downsample by factor of 4
      image_array = np.asarray(I)
      a = image_array.reshape(320, 320, 3).astype('float32')
      a = cv2.cvtColor(cv2.resize(a,(80,80)), cv2.COLOR_BGR2GRAY)
     
      cv2.imwrite('color_img.jpg', a)
      # print(frame[0][frame != 0])
      print("this is the frame size", a.size)
      ret, a = cv2.threshold(a, 127, 255, cv2.THRESH_BINARY) # et is useless
      a[a == 255] = 1
      I = a.ravel()
      print(len(I))

      if self.count == 20 :
        with open('final_file.csv', mode='w') as final_file: #store the pixels
              final_writer = csv.writer(final_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
              final_writer.writerow(I)

      self.count += 1
      # I = I[::16] # downsample by factor of 16
      # print(len(I))
    
     
      # I[I == 144] = 0 # erase background (background type 1)
      # I[I == 109] = 0 # erase background (background type 2)
      # I[I != 0] = 1 # everything else (paddles, ball) just set to 1
    
      
      # print(I)
      return I

    @classmethod
    def policy_forward(self, x):
      h = np.dot(self.model['W1'], x)
      h[h<0] = 0 # ReLU nonlinearity
      logp = np.dot(self.model['W2'], h)
      p = AndrejBot.sigmoid(logp)
      return p, h # return probability of taking action 2, and hidden state
