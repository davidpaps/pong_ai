from django.db import models

class SimpleBot(models.Model):
    
    @classmethod
    def simple_bot(request, court):
        return court["ball y"] > court["paddle y"]



