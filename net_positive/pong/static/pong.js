"use strict";

class Pong {
  constructor(canvas, imageProcessor, ball, player1, player2) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this.gameFinished = false;
    this.training = false;
    this.multiplayer = false;
    this.bot = 'rl-federer';
    this.isPointOver = false;
    this.aggregateReward = 0;
    this.imageProcessor = imageProcessor;
    this.ball = ball;
    this.players = [player1, player2];
    this.repeatAction = 3;
  }

  run(botSocket) {
    this.setPaddlesInitially()
    this.reset();
    let lastTime;
    var pong = this;

    function callback(milliseconds) {
      if (lastTime) {
        if (!pong.multiplayer) {pong.updatePaddles();}
        pong.updateGame((milliseconds - lastTime) / 1000);
        pong.updateReward();
      }
      lastTime = milliseconds;
      if (pong.isPointOver) {pong.reset();}
      pong.draw();
      if (!pong.multiplayer && botSocket.readyState === 1) {pong.getNextBotMoves(botSocket);} 
      requestAnimationFrame(callback);  
    }
    callback();
  }

  setPaddlesInitially() {
    this.players.forEach( player => { player.position.y = this._canvas.height / 2 });
    this.players[0].position.x = this.players[0].paddleOffsetStart;
    this.players[1].position.x = this._canvas.width - this.players[1].paddleOffsetStart;
  }

  updatePaddles() {
    if (this.players[1].repeatActionCount < this.repeatAction) {
      this.players[1].botMove(this._canvas.height);
    }
    if (this.players[0].repeatActionCount < this.repeatAction && this.training) {
      this.players[0].botMove(this._canvas.height);
    }
  }

  getNextBotMoves(botSocket) {
    if (this.players[1].responseReceived) {
      this.getBotMove(botSocket);
    }
    if ((this.training) && (this.players[0].responseReceived)) {
      this.getTrainingOpponentMove(botSocket);
    }
  }

  getBotMove(botSocket) {
    this.players[1].responseReceived = false;
    botSocket.send(JSON.stringify({
      "court": this.retrieveCourtData(this.players[1]),
      "image": this.imageProcessor.retrievePixelData(this._context),
      "done": this.gameFinished,
      "reward": this.aggregateReward,
      "bot": this.bot,
      "trainingopponent": "false"
    }));
    this.gameFinished = false;
    this.aggregateReward = 0;
  }

  getTrainingOpponentMove(botSocket) {
    this.players[0].responseReceived = false;
    botSocket.send(JSON.stringify({
      "court": this.retrieveCourtData(this.players[0]),
      "image": "dummy",
      "done": "dummy",
      "reward": "dummy",
      "bot": "nodevak-djokovic",
      "trainingopponent": "true"
    }));
  }

  retrieveCourtData(player) {
    var bally = Math.round(this.ball.position.y);
    var paddley = player.position.y;
    var court = `{"bally": ${bally}, "paddley": ${paddley}}`;
    return court;
  }

  draw() {
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    if (this.multiplayer === true) {this.drawNet();}
    this.drawRectangle(this.ball);
    this.players.forEach(player => this.drawRectangle(player));
  }

  drawRectangle(rectangle) {
    this._context.fillStyle = '#fff';
    this._context.fillRect(rectangle.left, rectangle.top, rectangle.size.x, rectangle.size.y);
  }

  drawNet() {
    this._context.setLineDash([5, 5]);
    this._context.moveTo(300,0);
    this._context.lineTo(300,400);
    this._context.strokeStyle = '#FF00FF';
    this._context.stroke();
  }

  reset() {
    this.ball.resetPosition(this._canvas.width, this._canvas.height);
    this.players[0].resetPosition(this._canvas.height)
    this.players[1].resetPosition(this._canvas.height)
    this.isPointOver = false;

    if (this.players[0].score < 21 && this.players[1].score < 21) {
      if (!this.multiplayer) {this.ball.serve();}
    } 
    else {
      this.gameFinished = true;
      this.restartGame(); 
    }
  }

  restartGame() {
    this.players[1].score === 21 ? this.players[1].game++ : this.players[0].game++;
    this.players[0].score = 0;
    this.players[1].score = 0;
    this.updatePage();
    if (!this.multiplayer) {this.ball.serve();}
  }

  updateReward() {
    if (this.isPointOver) {
      this.ball.velocity.x < 0 ? this.aggregateReward++: this.aggregateReward--;
    }
  }

  updateGame(deltatime) {
    this.ball.updatePosition(deltatime);
    this.ball.collideTop();
    this.ball.collideBottom(this._canvas.height);
    this.ball.collideLeftPaddle(this.players[0]);
    this.ball.collideRightPaddle(this.players[1], this._canvas.width);
    this.updateScore();
  }

  updateScore() {
    if (this.ball.isOutOfPlay(this._canvas.width)) {
      this.ball.velocity.x < 0 ? this.players[1].score++ : this.players[0].score++;
      this.isPointOver = true;
      this.updatePage();
    }
  }

  updatePage() {
    $("#player1tally").text(pong.players[0].score)
    $("#player2tally").text(pong.players[1].score)
    $("#player1-game-tally").text(pong.players[0].game)
    $("#player2-game-tally").text(pong.players[1].game)
  }
}
