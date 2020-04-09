"use strict";

describe('Ball', function() {
  var paddleWidth = 8;
  var paddleHeight = 32;
  var paddleOffsetStart = 36;
  var player;
  var player2;
  var ballWidth = 4;
  var ballHeight = 8;
  var serveSpeed = 200;
  var ball;
  

  beforeEach(function() {
    player = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
    spyOnProperty(player, 'top', 'get').and.returnValue(144);
    spyOnProperty(player, 'bottom', 'get').and.returnValue(176);
    spyOnProperty(player, 'left', 'get').and.returnValue(32);
    spyOnProperty(player, 'right', 'get').and.returnValue(40);
    player2 = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
    spyOnProperty(player2, 'top', 'get').and.returnValue(144);
    spyOnProperty(player2, 'bottom', 'get').and.returnValue(176);
    spyOnProperty(player2, 'left', 'get').and.returnValue(280);
    spyOnProperty(player2, 'right', 'get').and.returnValue(288);
    ball = new Ball(ballWidth, ballHeight, serveSpeed);
  })

  describe("initialize", function() {
    it("renders in the correct size", function() {
      expect(ball.size.x).toEqual(4);
      expect(ball.size.y).toEqual(8);
    })
  })

  describe("isOutOfPlay", function() {
    it("returns true if ball is past left side of court", function() {
      ball.position.x = 1;
      expect(ball.isOutOfPlay(320)).toEqual(true);
    })

    it("returns true if ball is past right side of court", function() {
      ball.position.x = 319;
      expect(ball.isOutOfPlay(320)).toEqual(true);
    })
    
    it("returns false if ball is in the court", function() {
      ball.position.x = 2;
      expect(ball.isOutOfPlay(320)).toEqual(false);
    })
  })

  describe("isPaddleHit", function() {
    it("returns true if ball edge touches the face of left paddle ", function() {
      ball.position.x = 42;
      ball.position.y = 160;
      expect(ball.isPaddleHit(player)).toEqual(true);
    })

    it("returns true if ball edge moves slightly beyond face of left paddle ", function() {
      ball.position.x = 41;
      ball.position.y = 160;
      expect(ball.isPaddleHit(player)).toEqual(true);
    })

    it("returns false if ball edge is not beyond the face of the left paddle", function() {
      ball.position.x = 43;
      ball.position.y = 160;
      expect(ball.isPaddleHit(player)).toEqual(false);
    })

    it("returns false if ball edge is slightly beyond the face of the left paddle but is above the paddle", function() {
      ball.position.x = 41;
      ball.position.y = 139;
      expect(ball.isPaddleHit(player)).toEqual(false);
    })

    it("returns false if ball edge is slightly beyond the face of the left paddle but is below the paddle", function() {
      ball.position.x = 41;
      ball.position.y = 181;
      expect(ball.isPaddleHit(player)).toEqual(false);
    })

    it("returns false if ball is too far beyond the face of the left paddle", function() {
      ball.position.x = 29;
      ball.position.y = 160;
      expect(ball.isPaddleHit(player)).toEqual(false);
    })

    it("returns true if ball edge touches face of right paddle", function() {
      ball.position.x = 278;
      ball.position.y = 160;
      expect(ball.isPaddleHit(player2)).toEqual(true);
    })

    it("returns true if ball edge moves slightly beyond face of right paddle", function() {
      ball.position.x = 279;
      ball.position.y = 160;
      expect(ball.isPaddleHit(player2)).toEqual(true);
    })

    it("returns false if ball edge is not beyond the face of the right paddle", function() {
      ball.position.x = 277;
      ball.position.y = 160;
      expect(ball.isPaddleHit(player2)).toEqual(false);
    })

    it("returns false if ball edge is slightly beyond the face of the right paddle but is above the paddle", function() {
      ball.position.x = 279;
      ball.position.y = 139;
      expect(ball.isPaddleHit(player2)).toEqual(false);
    })

    it("returns false if ball is too far beyond the face of the right paddle", function() {
      ball.position.x = 291;
      ball.position.y = 160;
      expect(ball.isPaddleHit(player2)).toEqual(false);
    })
  })
});