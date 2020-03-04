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
| t3.micro               | 2             | 1 GiB        | $0.0118        |
| t3.2xlarge             | 8             | 32 GiB       | $0.3776        |
| m5.24xlarge            | 96            | 384 GiB      | $5.328         |
| c5.2xlarge             | 8             | 16 GiB       | $0.404         |
| c5.4xlarge             | 16            | 32 GiB       | $0.404         |
| c5.24xlarge            | 96            | 192 GiB      | $5.52          |
| p3.2xlarge             | 8             | 61 GiB       | $3.589         |
