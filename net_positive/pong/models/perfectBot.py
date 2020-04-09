from django.db import models

class PerfectBot(models.Model):
    @classmethod
    def get_move(request, ball_y, paddle_y):
        if int(ball_y) <= int(paddle_y):
            move_up = True
        else:
            move_up = False 
        return move_up