"use strict";

describe('Pong', function() {
  var testCanvas;
  var imageProcessor;
  var ball;
  var paddleWidth = 8;
  var paddleHeight = 32;
  var paddleOffsetStart = 36;
  var player1;
  var player2;
  var pong;
  
      
  beforeEach(function() {
    testCanvas = document.createElement('canvas');
    spyOn(testCanvas, 'getContext').and.returnValue('testcontext');
    spyOnProperty(testCanvas, 'width', 'get').and.returnValue(320);
    spyOnProperty(testCanvas, 'height', 'get').and.returnValue(320);
    imageProcessor = 'testImageProcessor';
    ball = 'testBall';
    player1 = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
    spyOn(player1, "botMove");
    player2 = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
    spyOn(player2, "botMove");
    pong = new Pong(testCanvas, imageProcessor, ball, player1, player2);
  })

  describe("setPaddlesInitially", function() {
    it("renders the players in the correct x position", function() {
      pong.setPaddlesInitially();
      expect(player1.position.x).toEqual(36);
      expect(player2.position.x).toEqual(284);
    })

    it("renders the players in the correct y position", function() {
      pong.setPaddlesInitially();
      expect(player1.position.y).toEqual(160);
      expect(player2.position.y).toEqual(160);
    })
  })

  describe("updatePaddles", function() {
    it("updates player2 paddle if repeat action count < 3 ", function() {
      player2.repeatActionCount = 2;
      pong.updatePaddles();
      expect(player2.botMove).toHaveBeenCalledWith(320);
    })
    it("does not update player2 paddle if repeat action count >= 3 ", function() {
      player2.repeatActionCount = 3;
      pong.updatePaddles();
      expect(player2.botMove).not.toHaveBeenCalled();
    })
    it("updates player1 paddle if repeat action count < 3 and training = true ", function() {
      player1.repeatActionCount = 2;
      pong.training = true;
      pong.updatePaddles();
      expect(player1.botMove).toHaveBeenCalledWith(320);
    })
    it("does not update player1 paddle if repeat action count < 3 and training = false ", function() {
      player1.repeatActionCount = 2;
      pong.training = false;
      pong.updatePaddles();
      expect(player1.botMove).not.toHaveBeenCalled();
    })
    it("does not update player1 paddle if repeat action count >= 3 ", function() {
      player1.repeatActionCount = 3;
      pong.training = true;
      pong.updatePaddles();
      expect(player1.botMove).not.toHaveBeenCalled();
    })
  })

  describe("getNextBotMoves", function() {
    it("gets player2 bot move once it has a response from the last request", function() {
      spyOn(pong, "getBotMove");
      spyOn(pong, "getTrainingOpponentMove");
      player2.responseReceived = true;
      var botSocket = 'testBotSocket';
      pong.getNextBotMoves(botSocket);
      expect(pong.getBotMove).toHaveBeenCalledWith(botSocket);
    })
    it("does not get player2 bot move before it has a response from the last request", function() {
      spyOn(pong, "getBotMove");
      spyOn(pong, "getTrainingOpponentMove");
      player2.responseReceived = false;
      var botSocket = 'testBotSocket';
      pong.getNextBotMoves(botSocket);
      expect(pong.getBotMove).not.toHaveBeenCalledWith(botSocket);
    })
    it("gets player1 bot move once it has a response from the last request and training = true", function() {
      spyOn(pong, "getBotMove");
      spyOn(pong, "getTrainingOpponentMove");
      pong.training = true;
      player1.responseReceived = true;
      var botSocket = 'testBotSocket'
      pong.getNextBotMoves(botSocket);
      expect(pong.getTrainingOpponentMove).toHaveBeenCalledWith(botSocket);
    })
    it("does not get player1 bot move before it has a response from the last request", function() {
      spyOn(pong, "getBotMove");
      spyOn(pong, "getTrainingOpponentMove");
      pong.training = true;
      player1.responseReceived = false;
      var botSocket = 'testBotSocket'
      pong.getNextBotMoves(botSocket);
      expect(pong.getTrainingOpponentMove).not.toHaveBeenCalled();
    })
    it("does not get player1 bot move if training = false", function() {
      spyOn(pong, "getBotMove");
      spyOn(pong, "getTrainingOpponentMove");
      pong.training = false;
      player1.responseReceived = true;
      var botSocket = 'testBotSocket'
      pong.getNextBotMoves(botSocket);
      expect(pong.getTrainingOpponentMove).not.toHaveBeenCalled();
    })
  })
  
})