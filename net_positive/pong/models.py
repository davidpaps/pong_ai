from django.db import models
import json

class SimpleBot(models.Model):
    
    @classmethod
    def simple_bot(request, court):
      print(court)

      if int(court["bally"]) <= int(court["paddley"]):
        print(True)
        return True
      else:
        print(False)
        return False

    @classmethod
    def simple_bot_ws(request, text_data):
      court = text_data
     
      
      if int(court["bally"]) <= int(court["paddley"]):
        print(True)
        return True
      else:
        print(False)
        return False




