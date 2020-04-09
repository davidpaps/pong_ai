"use strict";

describe('Player', function() {
  var paddleWidth = 8;
  var paddleHeight = 32;
  var paddleOffsetStart = 36;
  var player;        

  beforeEach(function() {
    player = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
    spyOn(player, "moveUp");
    spyOn(player, "moveDown");
  })

  describe("initialize", function() {
    it("renders in the correct size", function() {
      expect(player.size.x).toEqual(8);
      expect(player.size.y).toEqual(32);
    })
  })

  describe("botMove", function() {
    it("invokes moveUp when _moveUpBot is true", function() {
      player._moveUpBot = true;
      player.botMove(320);
      expect(player.moveUp).toHaveBeenCalledWith(12);
    })
    
    it("invokes moveDown when _moveUpBot is false", function() {
      player._moveUpBot = false;
      player.botMove(320);
      expect(player.moveDown).toHaveBeenCalledWith(12, 320);
    })
  })

  describe("humanMove", function() {
    it("invokes moveUp when moveUpHuman is true", function() {
      player.humanMove(320, true);
      expect(player.moveUp).toHaveBeenCalledWith(40);
    })

    it("invokes moveDown when moveUpHuman is false", function() {
      player.humanMove(320, false);
      expect(player.moveDown).toHaveBeenCalledWith(40, 320)
    })
  })

  describe("isMoveInCourtTop", function() {
    it("returns true if the player is at least a move away from the top of the court", function() {
      player.position.y = 12;
      expect(player.isMoveInCourtTop(12)).toEqual(true);
    })

    it("returns false if the player is less than a move away from the top of the court", function() {
      player.position.y = 11;
      expect(player.isMoveInCourtTop(12)).toEqual(false);
    })
  })

  describe("isMoveInCourtBottom", function() {
    it("returns true if the player is at least a move away from the bottom of the court", function() {
      player.position.y = 308;
      expect(player.isMoveInCourtBottom(12, 320)).toEqual(true);
    })
    
    it("returns false if the player is less than a move away from the bottom of the court", function() {
      player.position.y = 309;
      expect(player.isMoveInCourtBottom(12, 320)).toEqual(false);
    })
  })

});