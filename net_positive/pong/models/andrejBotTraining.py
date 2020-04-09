from django.db import models
from datetime import datetime
import numpy as np
import pickle
import csv
from pathlib import Path
import cv2

class AndrejBotTraining(models.Model):
    # hyperparameters
    H = 200 # number of hidden layer neurons
    batch_size = 10 # every how many episodes to do a param update?
    learning_rate = 1e-4
    gamma = 0.99 # discount factor for reward
    decay_rate = 0.99 # decay factor for RMSProp leaky sum of grad^2
    prev_x = None # used in computing the difference frame
    count = 0
    xs = []
    hs = []
    dlogps = []
    drs = []
    episode_number = 0
    reward_sum = 0
    my_file = Path("net_positive/pong/training/episode_file.csv")
    resume = True if my_file.is_file() else False
    episode_number = 0
    if resume:
        data = []
        row_index = 0
        with open('net_positive/pong/training/episode_file.csv', "r", encoding="utf-8", errors="ignore") as scraped:
            reader = csv.reader(scraped, delimiter=',')
            for row in reader:
                data.append(row[0])
        episode_number = int(data[0])
    benchmark = False
    D = 80 * 80
    start_model = {}
    if benchmark:
        np.random.seed(0) ; start_model['W1'] = np.random.randn(H,D) / np.sqrt(D) # "Xavier" initialization
        np.random.seed(0) ; start_model['W2'] = np.random.randn(H) / np.sqrt(H)
    else:
        start_model['W1'] = np.random.randn(H,D) / np.sqrt(D) # "Xavier" initialization
        start_model['W2'] = np.random.randn(H) / np.sqrt(H)
    model = pickle.load(open('net_positive/pong/training/our_game_andrej.p', 'rb')) if resume == True else start_model
    grad_buffer = { k : np.zeros_like(v) for k,v in model.items() } # update buffers that add up gradients over a batch
    rmsprop_cache = { k : np.zeros_like(v) for k,v in model.items() } # rmsprop memory
    running_reward = None
    cumulative_batch_rewards = 0
    batch_average = 0
    reward_sum = 0
      
    @classmethod
    def get_move(self, pixels, reward, done):
        if self.my_file.is_file():
            self.resume = True 

        if self.resume and self.count == 0:
            print('Resuming run')

        if not self.resume and self.count == 0:
            print('First run')
        
        if self.count > 0:
            self.reward_sum += float(reward)
            self.drs.append(reward) # record reward (has to be done after we call step() to get reward for previous action)

            if done: # an episode finished
                self.episode_number += 1

                # stack together all inputs, hidden states, action gradients, and rewards for this episode
                epx = np.vstack(self.xs)
                eph = np.vstack(self.hs)
                epdlogp = np.vstack(self.dlogps)
                epr = np.vstack(self.drs)
                self.xs,self.hs,self.dlogps,self.drs = [],[],[],[] # reset array memory

                # compute the discounted reward backwards through time
                discounted_epr = AndrejBotTraining.discount_rewards(epr).astype('float64')
                # standardize the rewards to be unit normal (helps control the gradient estimator variance)
                discounted_epr -= np.mean(discounted_epr)
                discounted_epr /= np.std(discounted_epr)

                epdlogp *= discounted_epr # modulate the gradient with advantage (PG magic happens right here.)
                grad = AndrejBotTraining.policy_backward(eph, epdlogp, epx)
                for k in self.model: self.grad_buffer[k] += grad[k] # accumulate grad over batch

                # perform rmsprop parameter update every batch_size episodes
                if self.episode_number % self.batch_size == 0:
                    for k,v in self.model.items():
                        g = self.grad_buffer[k] # gradient
                        self.rmsprop_cache[k] = self.decay_rate * self.rmsprop_cache[k] + (1 - self.decay_rate) * g**2
                        self.model[k] += self.learning_rate * g / (np.sqrt(self.rmsprop_cache[k]) + 1e-5)
                        self.grad_buffer[k] = np.zeros_like(v) # reset batch gradient buffer
            
                # boring book-keeping
                self.running_reward = self.reward_sum if self.running_reward is None else self.running_reward * 0.99 + self.reward_sum * 0.01
                
                if self.episode_number % self.batch_size == 1:
                    self.cumulative_batch_rewards = self.reward_sum
                    self.batch_average = self.reward_sum
                elif self.episode_number % self.batch_size == 0:
                    self.cumulative_batch_rewards += self.reward_sum
                    self.batch_average = self.cumulative_batch_rewards/self.batch_size
                else:
                    self.cumulative_batch_rewards += self.reward_sum
                    self.batch_average = self.cumulative_batch_rewards/(self.episode_number % self.batch_size)
                
                if self.episode_number % self.batch_size == 0: 
                    pickle.dump(self.model, open('net_positive/pong/training/our_game_andrej.p', 'wb'))

                if self.episode_number % self.batch_size == 0: 
                    with open('net_positive/pong/training/episode_file.csv', mode='w') as episode_file: #store the last episode
                        episode_writer = csv.writer(episode_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
                        episode_writer.writerow([self.episode_number])
                    with open('net_positive/pong/training/performance_file.csv', mode='a') as performance_file: #track performance over time
                        performance_writer = csv.writer(performance_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
                        performance_writer.writerow([datetime.now(), self.episode_number, self.batch_average])

                self.reward_sum = 0

        # preprocess the observation, set input to network to be difference image
        cur_x = AndrejBotTraining.prepro(pixels)

        x = cur_x - self.prev_x if self.prev_x is not None else np.zeros(self.D)
        self.prev_x = cur_x

        # forward the policy network and sample an action from the returned probability
        aprob, h = AndrejBotTraining.policy_forward(x)
        move_up = True if np.random.uniform() < aprob else False # roll the dice!
      
        # record various intermediates (needed later for backprop)
        self.xs.append(x) # observation
        self.hs.append(h) # hidden state
        y = 1 if move_up == True else 0 # a "fake label"
        self.dlogps.append(y - aprob) # grad that encourages the action that was taken to be taken (see http://cs231n.github.io/neural-networks-2/#losses if confused)
        # step the environment and get new measurements
        self.count += 1
        return move_up

    @classmethod
    def sigmoid(request, x): 
        return 1.0 / (1.0 + np.exp(-x)) # sigmoid "squashing" function to interval [0,1]

    @classmethod
    def prepro(self, I):
        """ prepro 320x320 frame into 6400 (80x80) 1D float vector """
        I = list(map(float, I))
        image_array = np.asarray(I)
        a = image_array.reshape(320, 320)
        a = cv2.resize(a,(80,80))
        a[a >= 0.5] = 1
        a = a.ravel()
        return a
    
    @classmethod
    def discount_rewards(self, r):
        """ take 1D float array of rewards and compute discounted reward """
        discounted_r = np.zeros_like(r)
        running_add = 0
        for t in reversed(range(0, r.size)):
            if r[t] != 0: running_add = 0 # reset the sum, since this was a game boundary (pong specific!)
            running_add = running_add * self.gamma + r[t]
            discounted_r[t] = running_add
        return discounted_r

    @classmethod
    def policy_forward(self, x):
        h = np.dot(self.model['W1'], x)
        h[h<0] = 0 # ReLU nonlinearity
        logp = np.dot(self.model['W2'], h)
        p = AndrejBotTraining.sigmoid(logp)
        return p, h # return probability of taking action, and hidden state

    @classmethod
    def policy_backward(self, eph, epdlogp, epx):
        """ backward pass. (eph is array of intermediate hidden states) """
        dW2 = np.dot(eph.T, epdlogp).ravel()
        dh = np.outer(epdlogp, self.model['W2'])
        dh[eph <= 0] = 0 # backpro prelu
        dW1 = np.dot(dh.T, epx)
        return {'W1':dW1, 'W2':dW2}
        
    @classmethod
    def import_csv(self, csvfilename):
        data = []
        row_index = 0
        with open(csvfilename, "r", encoding="utf-8", errors="ignore") as scraped:
            reader = csv.reader(scraped, delimiter=',')
            for row in reader:
                data.append(row[0])
        return data