from django.db import models

class FaultyBot(models.Model):
    @classmethod
    def get_move(request, ball_y, paddle_y):
        if str(ball_y) <= str(paddle_y):
            return True
        else:
            return False