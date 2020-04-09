from django.db import models
import numpy as np
import pickle
import cv2

class AndrejBot(models.Model):
    prev_x = None # used in computing the difference frame
    model = pickle.load(open('net_positive/pong/training/andrej_gold.p', 'rb'))

    @classmethod
    def get_move(self, pixels):
        D = 80 * 80
        # preprocess the observation, set input to network to be difference image
        cur_x = AndrejBot.prepro(pixels)
        x = cur_x - self.prev_x if self.prev_x is not None else np.zeros(D)
        self.prev_x = cur_x
        # forward the policy network and sample an action from the returned probability
        aprob, h = AndrejBot.policy_forward(x)
        move_up = True if 0.5 < aprob else False #take the action most likely to yield the best result
        return move_up

    @classmethod
    def sigmoid(request, x): 
        return 1.0 / (1.0 + np.exp(-x)) # sigmoid "squashing" function to interval [0,1]
      
    @classmethod
    def prepro(self, I):
        """ prepro 320x320 frame into 6400 (80x80) 1D float vector """
        I = list(map(float, I))
        I = np.asarray(I)
        I = I.reshape(320,320)
        I = cv2.resize(I,(80,80))
        I[I !=1] = 0
        I = I.ravel()
        return I

    @classmethod
    def policy_forward(self, x):
        h = np.dot(self.model['W1'], x)
        h[h<0] = 0 # ReLU nonlinearity
        logp = np.dot(self.model['W2'], h)
        p = AndrejBot.sigmoid(logp)
        return p, h # return probability of taking action, and hidden state

