# Net-Positive

__Makers Final Project:__

Our aim was to build a neural net that would learn to play the classic video game Pong! We then implemented this neural net in the backend of our program and connected it to our own version of Pong - built in Javascript!

__The Team:__ [*Asia Ellis*](https://github.com/asiaellis5), [*David Papamichael*](https://github.com/davidpaps), [*Jake Phillips*](https://github.com/Jakephillips55), [*Nicolas Raffray*](https://github.com/nicolasraffray), [*Tom Ratcliffe*](https://github.com/ratcliffetj)


## Initial setup

Clone this repository and in the command line type:

```
install pip3
```

```
 pip3 install -r requirements.txt
```

## How to run the app

From the terminal navigate to the directory:

```
cd Net-Positive-Makers
```
And run:

```
run python3 net_positive/manage.py runserver
```

Then open a browser and visit this link [*localhost::8000*](localhost:8000)

## Neural Networks

The neural networks we used were heavily based on the work done by Andrej Karpathy in his [Reinforcement Learning Blog](http://karpathy.github.io/2016/05/31/rl/). Using this neural network training approach we arrived at our most skilled neural net based Pong bot. His work also provided strong guidance for how a net should interact with the pong game and what values it should receive during training. We added additional logging and checkpointing capabilities to the training code to allow for better visibility during the training process.

This team tried different methods of including biases in the net, making it deeper and using Adam optimization instead of RMSprop. We found that the simple single layer without biases yielded far superior results when compared to the combination of the aforementioned specifications. Nevertheless, our version of the neural net is represented in the game as Bjorn Cyborg and its code can be seen in the models section of the project along with Andrej's.  

## Training 

The nets were trained over around 15,000 games of Pong using the OpenAI Gym Python library. After this training their forward propagation code and final network weights were ported into our python backend. This allowed the nets to then play our version of the game which was made to mimic the OpenAI Gym version as far as possible.

Training runs were completed on AWS EC2 instances, we found a C5.2xlarge instance provided a good balance between training speed and cost.

We also added the capability for the neural networks to be trained directly on our own JavaScript version of the game. Although this was found to be around 10 times slower due to the additional latency involved in the websocket communication between the frontend game and backend training code (compared to the approach where the Python training code directly invoked the OpenAI Gym Python library during training).


## Testing

To test all python directories, from the command line run:

```
 do python3 -m pytest 
```
 
For individual tests run from the command line:

```
py.test --spec
```

For Javascript tests, run from the command line:

```
jasmine server
```


## Arcade Mode

<img src="./images/arcade.png">


## Training Mode

<img src="./images/training.png">


## Multiplayer Mode

<img src="./images/multiplayer.png">


See it live on [*Heroku*](http://net-positive.herokuapp.com/)
