from django.test import TestCase
from pong.models import SimpleBot
from django.http import JsonResponse
from django.db import models
# Create your tests here.

class Test_simple_bot():
    def simple_bot_test(request, court):
        """test that bally and paddley are 
        printing the correct responses"""
        if int(court["bally"]) <= int(court["paddley"]):
          print(True)
          return True
        else:
          print(False)
          return False
    print('Build')

    assert('True is not True')

