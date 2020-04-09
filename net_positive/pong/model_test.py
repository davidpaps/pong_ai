import pytest
from django.http import JsonResponse
from django.views.generic import TemplateView
from pong.models import PerfectBot
from pong.models import NonPerfectBot
from pong.models import FaultyBot

class TestPerfectBot:
    def test_moves_up_correctly(self):
        """perfect bot moves up when below the ball"""
        assert PerfectBot.get_move('80', '120') == True

    def test_moves_down_correctly(self):
        """perfect bot moves down when above the ball"""
        assert PerfectBot.get_move('200', '150') == False


class TestNonPerfectBot:
    def test_moves_up_correctly(self):
        """non perfect bot moves up when below the ball 90 percent of the time"""
        assert NonPerfectBot.get_move('80', '120', 0.1) == True

    def test_makes_move_up_mistake(self):
        """non perfect bot moves down when below the ball 10 percent of the time"""
        assert NonPerfectBot.get_move('80', '120', 0.09) == False

    def test_moves_down_correctly(self):
        """non perfect bot moves down when above the ball 90 percent of the time"""
        assert NonPerfectBot.get_move('200', '150', 0.1) == False

    def test_makes_move_down_mistake(self):
        """non perfect bot moves up when above the ball 10 percent of the time"""
        assert NonPerfectBot.get_move('80', '60', 0.09) == True


class TestFaultyBot:
    def test_moves_up_correctly_when_ball_and_paddle_over_100(self):
        """faulty bot moves up when below the ball, ball and paddle both > 100"""
        assert FaultyBot.get_move('110', '120') == True

    def test_moves_down_correctly_when_ball_and_paddle_over_100(self):
        """faulty bot moves down when above the ball, ball and paddle both > 100"""
        assert FaultyBot.get_move('200', '150') == False

    def test_moves_up_correctly_when_ball_and_paddle_under_100(self):
        """faulty bot moves up when below the ball, ball and paddle both > 100"""
        assert FaultyBot.get_move('80', '90') == True

    def test_moves_down_correctly_when_ball_and_paddle_under_100(self):
        """faulty bot moves down when above the ball, ball and paddle both > 100"""
        assert FaultyBot.get_move('50', '30') == False

    def test_moves_down_incorrectly_when_straddling_100(self):
        """faulty bot moves down when below the ball, ball < 100 and paddle > 100"""
        assert FaultyBot.get_move('90', '110') == False

    def test_moves_up_incorrectly_when_straddling_100(self):
        """faulty bot moves up when above the ball, ball > 100 and paddle < 100"""
        assert FaultyBot.get_move('110', '90') == True


  