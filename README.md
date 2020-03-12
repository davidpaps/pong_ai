# Net-Positive-Makers
Makers final project - lets build a neural net

## Setup
* install pip3
* pip3 install -r requirements.txt

## How to run

* First Clone of fork this repo 
* Run the setup section
* From the terminal cd Net-Positive-Makers/net_positive
* python3 manage.py runserver
* Go to your browser and copy into the url localhost:8000

## Networks

This project is tightly based on the work done by Andrej Karpathy in his [Reinforcement Learning Blog](http://karpathy.github.io/2016/05/31/rl/). We used his network as the bot which represents the hardest net to play against. His work also provided strong guidance for how a net should interact with the pong game and what values it should receive. The nets were trained on the OpenAI gym and then put onto our game which was made to mimic the AIgym as close as possible. Modifications to the code were done to fit with the new game.

This team tried different methods of including biases in the net, making it deeper and using Adam optimization instead of RMSprop. We found that the simple single layer without biases yielded far superior results when compared to the combination of the aforementioned specifications. Nevertheless, our version of the neural net is represented in the game as Nodevak Djocokic and its code can be seen in the model's section of the project along with Andrej's.  

## Training 

The networks were trained on AWS EC2 most of the training runs were done on the C5.2xlarge as we found it was the most cost effective for our runtime and the nature of the problem. 

### Benchmarking of AWS instances for training a net

| EC2 instance type      | vCPU          | Memory       | Cost per hour  |
| -----------------------|:-------------:|:------------:| --------------:|
| t2.micro               | 2             | 1 GiB        | free tier      |
| t3.2xlarge             | 8             | 32 GiB       | $0.3776        |
| m5.24xlarge            | 96            | 384 GiB      | $5.328         |
| c5.2xlarge             | 8             | 16 GiB       | $0.404         |
| c5.4xlarge             | 16            | 32 GiB       | $0.404         |
| c5.24xlarge            | 96            | 192 GiB      | $5.52          |
| p3.2xlarge             | 8             | 61 GiB       | $3.589         |


Six neural nets were provisioned with different batch size parameters and allowed to train over the same number of episodes. The type of EC2 instance (t2.micro) and initial weights were kept the same. The result of batch size on average reward per episode can therefore be seen below.

| Batch size   | Av. reward over final 10 episodes of run   |              
| -------------|:------------------------------------------:|
| 3            |                                            |
| 5            |                                            |
| 7            |                                            |
| 10           |                                            |
| 12           |                                            |
| 15           |                                            |


To test all dirs do python3 -m pytest - if you do not want to see coverage
To see each indiviual method test py.test --spec (similar to Rspec)

Given the fact that we have problems such as unstable data, underfitted models, overfitted models, and uncertain future resiliency, what should we do? There are some general guidelines and techniques, known as heuristics, that we can write into tests to mitigate the risk of these issues arising.
We can test those two seams by unit testing our data inputs and outputs to make sure they are valid within our given tolerances.