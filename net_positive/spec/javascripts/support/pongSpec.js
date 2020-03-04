"use strict";

describe('Pong', function() {
  var pong;
  var testCanvas;
  var fakeDocument;
  var ball;
  var rectangle;
  var player;           


  beforeEach(function() {
    testCanvas = {
      height: 150,
      width: 150,
      getContext: function() {
        
      }
    }
  
    pong = new Pong(testCanvas);
    rectangle = new Rectangle()
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
      ball = new Ball()
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
  })


})