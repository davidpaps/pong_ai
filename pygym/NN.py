import gym
import random 
import numpy as np 
import tensorflow as tf 
import keras
import cv2

DENSE = 200
BATCH_SIZE = 10 
LEARNING_RATE = 1e-3
GAMMA = 0.99
DISCOUNT = 0.99

# below function used for balck and white game
def pre_process_image(frame): # function for when we use the main pong on server
  """ prepro 210x160x3 uint8 frame into 6400 (80x80) 1D float vector """
  frame = cv2.cvtColor(cv2.resize(frame,(75,80)), cv2.COLOR_BGR2GRAY)
  ret, frame = cv2.threshold(frame, 1, 255, cv2.THRESH_BINARY) # ret is useless
  frame = frame.ravel()
  return frame

def prepro(I): # function for openai gym image conversion taken from a Deeplearning site
  """ prepro 210x160x3 uint8 frame into 6000 (75x80) 1D float vector """
  I = I[35:185] # crop - remove 35px from start & 25px from end of image in x, to reduce redundant parts of image (i.e. after ball passes paddle)
  I = I[::2,::2,0] # downsample by factor of 2.
  I[I == 144] = 0 # erase background (background type 1)
  I[I == 109] = 0 # erase background (background type 2)
  I[I != 0] = 1 # everything else (paddles, ball) just set to 1. this makes the image grayscale effectively
  return I.astype(np.float).ravel()

model = keras.Sequential([
  keras.layers.Dense(150, activation=tf.nn.relu, input_shape=(1,), kernel_initializer='glorot_uniform'),
  keras.layers.Dense(50, activation=tf.nn.relu, kernel_initializer='glorot_uniform'),
  keras.layers.Dense(1, use_bias = False, activation=tf.nn.sigmoid),
])

model.compile(loss='mean_squared_error', optimizer='rmsprop')

def true_y(action): 
  ''' function for randomly generating true y ''' 
  if action == 2:
    y = 1 
  else:
    0 

env = gym.make("Pong-v0")
env.reset()
# # print(env.get_action_meanings())
# # env = gym.wrappers.Monitor(env,'./',force=True)

print(model.summary)

y_hat = []
# for i_pepisode in range(20):
#   observation = env.reset()
#   for t in range(100):
#       env.render()
#       # print(env.unwrapped.get_action_meanings())
#       frame = pre_process_image(observation)
#       frame = prepro(observation)
     
#      # difference of frames
#       if t == 0:
#         d_frame = frame - np.zeros(frame.shape)
#         prev_frame = frame
#       else:
#         d_frame = frame - prev_frame 
#         prev_frame = frame  

#       action = env.action_space.sample()
#       y_hat.append(true_y(action))

#       action = env.action_space.sample()
#       observation, reward, done, info = env.step(action)
#       if done:
#           print("Episode finished after {} timesteps".format(t+1))
#           break
#   model.fit(x = d_frame, y = y_hat ) # i think y_hat wrong
        
# env.close()

# Numpy methods

def relu(Z): 
  np.maximum(0.0,Z)

def forward_prop(input_array, weights_dict): 
  Z1 = np.dot(input_array, weights_dict['W1'])
  A1 = relu(Z1)
