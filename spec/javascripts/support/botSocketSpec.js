"use strict";

describe('botSocket', function() {
  var paddleWidth = 8;
  var paddleHeight = 32;
  var paddleOffsetStart = 36;
  var player1;
  var player2;
  var botSocket;
  
  beforeEach(function() {
    player1 = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
    spyOn(player1, "storeMove");
    player2 = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
    spyOn(player2, "storeMove");
    botSocket = new BotSocket('ws://testurl:8000', player1, player2);
  })

  describe("parseAndStore", function() {
    it("stores moveup true against first player", function() {
      var response = JSON.stringify({
        'moveup': true,
        'playerID': 0
      })
      botSocket.parseAndStore(response);
      expect(player1.storeMove).toHaveBeenCalledWith(true);
    })

    it("stores moveup true against second player", function() {
      var response = JSON.stringify({
        'moveup': true,
        'playerID': 1
      })
      botSocket.parseAndStore(response);
      expect(player2.storeMove).toHaveBeenCalledWith(true);
    })

    it("stores moveup false against first player", function() {
      var response = JSON.stringify({
        'moveup': false,
        'playerID': 0
      })
      botSocket.parseAndStore(response);
      expect(player1.storeMove).toHaveBeenCalledWith(false);
    })

    it("stores moveup false against second player", function() {
      var response = JSON.stringify({
        'moveup': false,
        'playerID': 1
      })
      botSocket.parseAndStore(response);
      expect(player2.storeMove).toHaveBeenCalledWith(false);
    })
  })
});