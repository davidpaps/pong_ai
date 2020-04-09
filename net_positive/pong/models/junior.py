from django.db import models
import numpy as np
import pickle
import csv
import cv2

class Junior(models.Model):
    prev_x = None 
    model = pickle.load(open('net_positive/pong/training/junior.p', 'rb'))


    @classmethod 
    def get_move(self, pixels):
        D = 80 * 80
        cur_x = Junior.prepro(pixels)
        x = cur_x - self.prev_x if self.prev_x is not None else np.zeros(D)
        self.prev_x = cur_x
        forward_output = Junior.forward_prop(x, self.model)
        move = Junior.make_move(forward_output["A3"])
        return move

    @classmethod
    def prepro(self, I): 
        """ prepro 320x320 frame into 6400 (80x80) 1D float vector """
        I = list(map(float, I))
        I = np.asarray(I)
        I = I.reshape(320, 320)
        I = cv2.resize(I,(80,80))
        I[I !=1] = 0
        I = I.ravel()
        return I

    @classmethod 
    def relu(self, Z): 
        return np.maximum(0.0,Z) 

    @classmethod
    def make_move(self, A3):
        if A3 > 0.5:
            action = True
        else:
            action = False 
        return action

    @classmethod 
    def forward_prop(self, input_array, weights_dict): 
        Z1 = np.dot(weights_dict['W1'], input_array) + weights_dict["B1"]
        A1 = Junior.relu(Z1)
        Z2 = np.dot(weights_dict['W2'], A1) + weights_dict["B2"]
        A2 = Junior.relu(Z2)
        Z3 = np.dot(weights_dict['W3'], A2)
        A3 = 1.0 / (1.0 + np.exp(-Z3))
        forward_output = {"X": input_array, "Z1": Z1, "A1": A1,
        "Z2": Z2, "A2": A2, "A3": A3}
        return forward_output




