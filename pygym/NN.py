import gym
import random 
import numpy as np
import cv2
from pathlib import Path
import csv

render = True
resume = False
batch_size = 10 # every how many episodes to do a param update?
learning_rate = 1e-4
gamma = 0.99 # discount factor for reward
decay_rate = 0.99

# resume from previous checkpoint?

my_file = Path("./episode_file.csv")
if my_file.is_file():
  print('Resuming run')
  resume = True
else:
  print('First run')
  resume = False

# below function used for balck and white game
def pre_process_image(frame): # function for when we use the main pong on server
  """ prepro 210x160x3 uint8 frame into 6400 (80x80) 1D float vector """
  frame = cv2.cvtColor(cv2.resize(frame,(75,80)), cv2.COLOR_BGR2GRAY)
  ret, frame = cv2.threshold(frame, 1, 255, cv2.THRESH_BINARY) # ret is useless
  frame = frame.ravel()
  return frame

def prepro(I): # function for openai gym image conversion taken from a Deeplearning site
  """ prepro 210x160x3 uint8 frame into 6000 (75x80) 1D float vector """
  I = I[35:195] # crop - remove 35px from start & 25px from end of image in x, to reduce redundant parts of image (i.e. after ball passes paddle)
  I = I[::2,::2,0] # downsample by factor of 2.
  I[I == 144] = 0 # erase background (background type 1)
  I[I == 109] = 0 # erase background (background type 2)
  I[I != 0] = 1 # everything else (paddles, ball) just set to 1. this makes the image grayscale effectively
  return I.astype(np.float).ravel()

dimension = 80 * 80

model = {}
model['W1'] = np.random.randn(200,dimension)/np.sqrt(dimension)
model['W2'] = np.random.randn(50,200)/np.sqrt(200)
model['W3'] = np.random.randn(50)/np.sqrt(50)

grad_buffer = { k : np.zeros_like(v) for k,v in model.items() } # update buffers that add up gradients over a batch
#updated .iteritems to .items
rmsprop_cache = { k : np.zeros_like(v) for k,v in model.items() } 

def discount_rewards(r):
  """ take 1D float array of rewards and compute discounted reward """
  discounted_r = np.zeros_like(r)
  running_add = 0
  for t in reversed(range(0, r.size)):
    if r[t] != 0: running_add = 0 # reset the sum, since this was a game boundary (pong specific!)
    running_add = running_add * gamma + r[t]
    discounted_r[t] = running_add
  discounted_r
  # standardizing
  discounted_r -= np.mean(discounted_r)
  discounted_r /= np.std(discounted_r)
  return discounted_r



def relu(Z): 
  return np.maximum(0.0,Z)

def forward_prop(input_array, weights_dict): 
  Z1 = np.dot(weights_dict['W1'], input_array)
  A1 = relu(Z1)
  Z2 = np.dot(weights_dict['W2'], A1)
  A2 = relu(Z2)
  Z3 = np.dot(weights_dict['W3'], A2)
  A3 = 1.0 / (1.0 + np.exp(-Z3))
  return A3, A2, A1

def make_move(A3):
  if A3 > 0.8:
    action = 2 
  elif np.random.uniform() < A3:
    action = 2
  else:
    action = 3 
  return action 

def Relu_derivative(Z):
    Z[Z > 0 ] = 1
    Z[Z <= 0] = 0 
    return Z


# After move step environment forward
def true_y(action): 
  ''' function for randomly generating true y ''' 
  if action == 2:
    y = 1 
  else:
    y = 0 
  return y 

# states from forward prop need to be saved for backprop

def compute_grad(y,A3): 
  loss_grad.append(y - A3) # this value needs to be appended into an array


def back_prop(episode_A2, episode_A1, episode_input, episode_end_grad):
  dW3 = np.dot(episode_A2.T, episode_end_grad).ravel()
  dA2 = np.outer(episode_end_grad, model['W3'])
  dZ2 = Relu_derivative(episode_A2)
  dW2 = np.dot(dZ2.T, episode_A1).ravel()
  dB2 = dZ2 
  dA1 = np.outer(dZ2, model['W2'])
  dZ1 = Relu_derivative(episode_A1)
  dW1 = np.dot(dZ1.T, episode_input)
  dB1 = dZ1
  derivatives = { 'W1': dW1,'W2': dW2, 'W3': dW3 }
  return derivatives


env = gym.make("Pong-v0")
observation = env.reset()
prev_frame = None
state, h1, h2, h3, loss_grad, r = [], [], [], [], [], []
running_reward = None
reward_sum = 0 

if resume:
  data = import_csv('episode_file.csv')
  episode_number = int(data[0])
else:
  episode_number = 0

while True:
  if render: env.render()

  
  frame = prepro(observation)
  d_frame = frame - prev_frame if prev_frame is not None else np.zeros(dimension)
  prev_frame = frame
  A3, A2, A1 = forward_prop(d_frame, model)

  state.append(d_frame)
  h1.append(A1)
  h2.append(A2)
  h3.append(A3)

  action = make_move(A3)
  y = true_y(action)
  loss_grad.append(y - A3)

  observation,reward,done,info = env.step(action)
  r.append(reward)
  reward_sum += reward


  if done: 
    episode_number += 1 

    episode_input = np.vstack(state)
    episode_h1 = np.vstack(h1)
    episode_h2 = np.vstack(h2)
    episode_h3 = np.vstack(h3)
    episode_loss_grad = np.vstack(loss_grad)
    episode_reward = np.vstack(r)

    state, h1, h2, h3, loss_grad, r = [], [], [], [], [], []

    discounted_ep_rewards = discount_rewards(episode_reward)

    episode_loss_grad *= discounted_ep_rewards
    grad = back_prop(episode_h1, episode_h2, episode_input, episode_loss_grad)
    
    for k in model: grad_buffer[k] += grad[k] # accumulate grad over batch

    if episode_number % batch_size == 0: 
      for k,v in model.items():
        g = grad_buffer[k]
        rmsprop_cache[k] = decay_rate * rmsprop_cache[k] + (1-decay_rate) * g**2
        model[k] += learning_rate * g / (np.sprt(rmsprop_cache[k]) + 1e-5)
        grad_buffer[k] = np.zeros_like(v)

    if episode_number % (batch_size) == 0: 
      with open('performace_file.csv', mode='a') as performace_file:
        performance_writer = csv.writer(performance_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        performance_writer.writerow([episode_number, reward_sum])
      with open('episode_file.csv', mode='w') as episode_file: #store the last episode
        episode_writer = csv.writer(episode_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        episode_writer.writerow([episode_number])

    reward_sum = 0 
    observation = env.reset() # reset env
    prev_x = None
    
        
env.close()

# The net in Numpy methods