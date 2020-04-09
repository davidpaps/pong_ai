"use strict";

class BotSocket extends WebSocket {
  constructor(url, player1, player2) {
    super(url);
    this.players = [player1, player2];
  }

  handleWebSocketResponse() {
    this.onmessage = function(e) {
      this.parseAndStore(e.data);
    }
  }

  parseAndStore(response) {
    var response = JSON.parse(response);
    var playerID = parseInt(response.playerID);
    this.players[playerID].storeMove(response['moveup']);
  }

  handleWebSocketClose() {
    this.onclose = function(e) {
      console.error('Chat socket closed unexpectedly');
    }
  }
}