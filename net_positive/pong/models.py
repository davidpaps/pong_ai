from django.db import models

class SimpleBot(models.Model):
    
    @classmethod
    def simple_bot(request, court):
        print(court)
        if court["bally"] <= court["paddley"]:
            print(True)
            return True
        else:
            print(False)
            return False




