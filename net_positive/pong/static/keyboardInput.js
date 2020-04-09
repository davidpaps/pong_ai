"use strict";

class KeyboardInput {
  constructor(pong) {
    this.pong = pong;
  }

  arcadeMode() {
    var pong = this.pong
    window.addEventListener('keydown', keyboardHandlerFunction);
    function keyboardHandlerFunction(e) {
      if (e.keyCode === 38) {
        pong.players[0].humanMove(pong._canvas.height, true);
      }
      if (e.keyCode === 40) {
        pong.players[0].humanMove(pong._canvas.height, false);
      }
    }
  }

  multiplayerMode() {
    var pong = this.pong
    window.addEventListener('keydown', keyboardHandlerFunction);
    function keyboardHandlerFunction(e) {
      if (e.keyCode === 87) {
        pong.players[0].humanMove(pong._canvas.height, true);
      }
      if (e.keyCode === 83) {
        pong.players[0].humanMove(pong._canvas.height, false);
      }
      if (e.keyCode === 38) {
        pong.players[1].humanMove(pong._canvas.height, true);
      }
      if (e.keyCode === 40) {
        pong.players[1].humanMove(pong._canvas.height, false);
      }
      if(e.keyCode === 32) {
        pong.ball.serve();
      } 
    }
  }
}