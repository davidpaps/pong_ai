# Net-Positive-Makers
Makers final project - lets build a neural net

## Setup
* install pip3
* pip3 install -r requirements.txt

## How to run

* python3 manage.py runserver


## Benchmarking of AWS instances for training a net

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

- added to heroku using git push heroku master will turn on auto deploy in the next hour

