# Net-Positive-Makers

Makers final project - lets build a neural net that can play Pong and hook it up to our own JavaScript version of the game

## Initial setup

* Clone this repository
* install pip3
* pip3 install -r requirements.txt

## How to run the app

* From the terminal cd Net-Positive-Makers/net_positive
* run python3 manage.py runserver
* Go to your browser and navigate to localhost:8000

## Neural Networks

The neural networks we used were heavily based on the work done by Andrej Karpathy in his [Reinforcement Learning Blog](http://karpathy.github.io/2016/05/31/rl/). Using this neural network training approach we arrived at our most skilled neural net based Pong bot. His work also provided strong guidance for how a net should interact with the pong game and what values it should receive during training. We added additional logging and checkpointing capabilities to the training code to allow for better visibility during the training process.

This team tried different methods of including biases in the net, making it deeper and using Adam optimization instead of RMSprop. We found that the simple single layer without biases yielded far superior results when compared to the combination of the aforementioned specifications. Nevertheless, our version of the neural net is represented in the game as Bjorn Cyborg and its code can be seen in the models section of the project along with Andrej's.  

## Training 

The nets were trained over around 15,000 games of Pong using the OpenAI Gym Python library. After this training their forward propagation code and final network weights were ported into our python backend. This allowed the nets to then play our version of the game which was made to mimic the OpenAI Gym version as far as possible.

Training runs were completed on AWS EC2 instances, we found a C5.2xlarge instance provided a good balance between training speed and cost.

We also added the capability for the neural networks to be trained directly on our own JavaScript version of the game. Although this was found to be around 10 times slower due to the additional latency involved in the websocket communication between the frontend game and backend training code (compared to the approach where the Python training code directly invoked the OpenAI Gym Python library during training).


## Testing

To test all dirs do python3 -m pytest - if you do not want to see coverage
To see each indiviual method test py.test --spec (similar to Rspec)

