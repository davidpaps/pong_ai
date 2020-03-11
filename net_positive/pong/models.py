from django.db import models
import json

class SimpleBot(models.Model):
    
    @classmethod
    def simple_bot(request, court):
      if int(court["bally"]) <= int(court["paddley"]):
        print(True)
        return True
      else:
        print(False)
        return False

    @classmethod
    def simple_bot_ws(request, bally, paddley, reward):
      if int(bally) <= int(paddley):
        print(True)
        return True
      else:
        print(False)
        return False




