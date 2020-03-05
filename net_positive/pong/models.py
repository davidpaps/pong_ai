from django.db import models

class SimpleBot(models.Model):
    
    @classmethod
    def simple_bot(request):
        return request["ball y"] > request["paddle y"]



