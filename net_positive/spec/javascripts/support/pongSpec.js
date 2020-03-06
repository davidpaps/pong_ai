"use strict";

describe('Pong', function() {
  var pong;
  var testCanvas;
  var ball;
  var player;        


  beforeEach(function() {
   
    testCanvas = document.createElement('canvas')
    testCanvas.width = 150
    testCanvas.height = 150
    testCanvas.id = 'pong'
  
    pong = new Pong(testCanvas);
    ball = new Ball()
    player = new Player()
  })

  describe("canvas dimensions", function() {
    it("draws the correct height", function() {
      expect(pong._canvas.height).toEqual(150)
    })
    it("draws the correct width", function() {
      expect(pong._canvas.width).toEqual(150)
    })
  })

  describe("ball", function() {
    it("renders in the correct size", function() {
      expect(ball.size.x).toEqual(10)
      expect(ball.size.y).toEqual(10)
    })
  })

  describe("player", function() {
    it("it renders in the correct size", function() {
      player = new Player()
      expect(player.size.x).toEqual(20)
      expect(player.size.y).toEqual(100)
    })

    it("renders the players in the correct x position", function() {
      expect(pong.players[0].position.x).toEqual(20)
      expect(pong.players[1].position.x).toEqual(130)
    })

    it("renders the players in the correct y position", function() {
      expect(pong.players[0].position.y).toEqual(75)
      expect(pong.players[1].position.y).toEqual(75)
    })
  })


})