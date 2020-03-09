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


To test all dirs do - coverage run -m pytest
alternatively you can run pyest spec if you do not want to see level of test coverage

Given the fact that we have problems such as unstable data, underfitted models, overfitted models, and uncertain future resiliency, what should we do? There are some general guidelines and techniques, known as heuristics, that we can write into tests to mitigate the risk of these issues arising.
We can test those two seams by unit testing our data inputs and outputs to make sure they are valid within our given tolerances.