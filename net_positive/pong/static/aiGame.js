"use strict";

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  set length(value) {
    const factor = value / this.length;
    this.x *= factor;
    this.y *= factor;
  }
}

class Rectangle {
  constructor(w, h) {
    this.position = new Vector();
    this.size = new Vector(w, h);
  }
  get left() {
    return this.position.x - this.size.x / 2;
  }
  get right() {
    return this.position.x + this.size.x / 2;
  }
  get top() {
    return this.position.y - this.size.y / 2;
  }
  get bottom() {
    return this.position.y + this.size.y / 2;
  }
}

class Ball extends Rectangle {
  constructor(w, h) {
    super(w, h);
    this.velocity = new Vector();
  }
}

class Player extends Rectangle {
  constructor(w, h) {
    super(w, h);
    this.score = 0;
    this.game = 0;
    this.velocity = new Vector();
  }
}

class BotSocket extends WebSocket {
  constructor() {
    super("ws://" + window.location.host + "/ws/pong/training/");
  }
}

class Pong {
  constructor(canvas) {
    this.ballHeight = 8;
    this.ballWidth = 4;
    this.paddleHeight = 32;
    this.paddleWidth = 8;
    this.botSpeed = 12;
    this.paddleOffsetStart = 36;
    this._moveUpBot = "";
    this._movUpTrainingOpponent = "";
    this._canvas = canvas;
    this._context = canvas.getContext("2d");
    this.repeatActionCountBot = 0;
    this.repeatActionCountTrainingOpponent = 0;
    this.ball = new Ball(this.ballWidth, this.ballHeight);
    this.gameFinished = false;
    this.training = false;
    this.bot = "rl-federer";
    this.isPointOver = false;
    this.aggregateReward = 0;
    this.responseReceivedBot = true;
    this.responseReceivedTrainingOpponent = true;
    this.players = [
      new Player(this.paddleWidth, this.paddleHeight),
      new Player(this.paddleWidth, this.paddleHeight)
    ];
    this.players[0].position.x = this.paddleOffsetStart;
    this.players[1].position.x = this._canvas.width - this.paddleOffsetStart;
    this.players.forEach(player => {
      player.position.y = this._canvas.height / 2;
    });
    this.BotSocket = new BotSocket();

    var that = this;

    this.BotSocket.onmessage = function(e) {
      var data = JSON.parse(e.data);
      if (data["trainingopponent"] === "false") {
        that.storeMove(data["move"]);
      } else {
        that.storeTrainingOpponentMove(data["move"]);
      }
    };

    this.BotSocket.onclose = function(e) {
      console.error("Chat socket closed unexpectedly");
    };

    let lastTime;
    const callback = milliseconds => {
      if (lastTime) {
        if (this.repeatActionCountBot < 3) {
          this.botUpdate(this._moveUpBot);
        }
        if (this.repeatActionCountTrainingOpponent < 3) {
          this.trainingOpponentMove(this._moveUpTrainingOpponent);
        }
        this.update((milliseconds - lastTime) / 1000);
        this.updateReward();
      }
      lastTime = milliseconds;

      requestAnimationFrame(callback);

      if (this.isPointOver === true) {
        this.reset();
      }

      this.draw();

      if (this.BotSocket.readyState === 1) {
        if (this.responseReceivedBot === true) {
          // this.draw();
          // uncomment the above line to see what the bot is seeing
          this.getMove();
          this.gameFinished = false;
          this.aggregateReward = 0;
        }

        if (
          this.training === true &&
          this.responseReceivedTrainingOpponent === true
        ) {
          this.responseReceivedTrainingOpponent = false;
          this.getTrainingOpponentMove();
        }
      }
    };

    callback();
  }

  storeMove(move) {
    this._moveUpBot = move;
    this.responseReceivedBot = true;
    this.repeatActionCountBot = 0;
  }

  storeTrainingOpponentMove(move) {
    this._moveUpTrainingOpponent = move;
    this.responseReceivedTrainingOpponent = true;
    this.repeatActionCountTrainingOpponent = 0;
  }

  getMove() {
    this.responseReceivedBot = false;
    this.BotSocket.send(
      JSON.stringify({
        court: this.retrieveGameData(1),
        image: this.retrievePixelData(),
        done: this.gameFinished,
        bot: this.bot,
        trainingopponent: "false"
      })
    );
  }

  getTrainingOpponentMove() {
    this.BotSocket.send(
      JSON.stringify({
        court: this.retrieveGameData(0),
        image: "dummy",
        done: "dummy",
        bot: "nodevak-djokovic",
        trainingopponent: "true"
      })
    );
  }

  retrieveGameData(player) {
    var bally = Math.round(this.ball.position.y);
    var paddley = this.players[player].position.y;
    var reward = this.aggregateReward;
    var court = `{"bally": ${bally}, "paddley": ${paddley}, "reward": ${reward}}`;
    console.log(reward);
    return court;
  }

  retrievePixelData() {
    var image = this._context.getImageData(0, 0, 320, 320);
    var imageArray = Array.from(image.data);
    imageArray = this.rgbaToBinary(imageArray);
    var imageString = imageArray.join("");
    imageString = this.compressString(imageString);
    return imageString;
  }

  compressString(imageString) {
    //first round of compression
    var regex80 = /00000000000000000000000000000000000000000000000000000000000000000000000000000000/gi;
    var regex40 = /0000000000000000000000000000000000000000/gi;
    var regex20 = /00000000000000000000/gi;
    var regex10 = /0000000000/gi;
    var regex4 = /1111/gi;
    imageString = imageString.replace(regex80, "w");
    imageString = imageString.replace(regex40, "x");
    imageString = imageString.replace(regex20, "y");
    imageString = imageString.replace(regex10, "z");
    imageString = imageString.replace(regex4, "a");
    // second round of compression
    var regexW = /wwwwwwwwwwwwwwwwwwww/gi;
    imageString = imageString.replace(regexW, "v");
    return imageString;
  }

  rgbaToBinary(imageArray) {
    imageArray = imageArray.filter(function(_, i) {
      return (i + 1) % 4;
    });
    imageArray = imageArray.filter(function(_, i) {
      return (i + 1) % 3;
    });
    imageArray = imageArray.filter(function(_, i) {
      return (i + 1) % 2;
    });

    var everyOtherTime = 0;

    for (var i = 0, len = imageArray.length; i < len; i++) {
      if (imageArray[i] < 127.5) {
        imageArray[i] = 0;
      } else if (imageArray[i] == 127.5) {
        if (everyOtherTime % 2 == 0) {
          imageArray[i] = 1;
          everyotherTime += 1;
        }
      } else {
        imageArray[i] = 1;
      }
    }
    return imageArray;
  }

  collide(player, ball) {
    if (
      player.left <= ball.right &&
      player.right >= ball.left &&
      player.top <= ball.bottom &&
      player.bottom >= ball.top
    ) {
      const length = ball.velocity.length;

      if (ball.position.x > this._canvas.width / 2) {
        ball.position.x = 280;
      } else {
        ball.position.x = 40;
      }

      ball.velocity.x = -ball.velocity.x;
      ball.velocity.y += ball.velocity.y * (Math.random() - 0.5);

      // ball and paddle collision like the actual Atari Pong
      // var relativeIntersectY = player.position.y - ball.position.y;
      // var normalizedRelativeIntersectionY = relativeIntersectY/(32/2);
      // var bounceAngle = normalizedRelativeIntersectionY * 5 * Math.PI / 12;
      // ball.velocity.x = ball.velocity.length * Math.cos(bounceAngle);
      // ball.velocity.y = ball.velocity.length * - Math.sin(bounceAngle);

      ball.velocity.length = length * 1.05;
    }
  }

  draw() {
    this._context.fillStyle = "#000";
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this.drawRectangle(this.ball);
    this.players.forEach(player => this.drawRectangle(player));
  }

  drawRectangle(rectangle) {
    this._context.fillStyle = "#fff";
    this._context.fillRect(
      rectangle.left,
      rectangle.top,
      rectangle.size.x,
      rectangle.size.y
    );
  }

  reset() {
    this.ball.position.x = this._canvas.width / 2;
    this.ball.position.y = this._canvas.height / 2;
    this.ball.velocity.x = 0;
    this.ball.velocity.y = 0;
    this.players[0].position.y = this._canvas.height / 2;
    this.players[1].position.y = this._canvas.height / 2;
    this.isPointOver = false;

    if (this.players[0].score < 21 && this.players[1].score < 21) {
      this.start();
    } else {
      this.gameFinished = true;
      this.restartGame();
    }
  }

  start() {
    this.ball.velocity.x = Math.random() > 0.5 ? 1 : -1;
    this.ball.velocity.y = Math.random() > 0.5 ? 1 : -1;
    this.ball.velocity.length = 200;
  }

  restartGame() {
    var playerId;
    if (this.players[1].score === 21) {
      playerId = 1;
    } else {
      playerId = 0;
    }
    this.players[playerId].game += 1;
    this.players[0].score = 0;
    this.players[1].score = 0;
    this.start();
  }

  updateReward() {
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      if (this.ball.velocity.x < 0) {
        this.aggregateReward += 1;
      } else {
        this.aggregateReward += -1;
      }
    }
  }

  update(deltatime) {
    this.ball.position.x += this.ball.velocity.x * deltatime;
    this.ball.position.y += this.ball.velocity.y * deltatime;

    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      var playerId;
      if (this.ball.velocity.x < 0) {
        playerId = 1;
        this.isPointOver = true;
        this.players[playerId].score++;
        this.updateScore();
      } else if (this.ball.velocity.x > 0) {
        playerId = 0;
        this.isPointOver = true;
        this.players[playerId].score++;
        this.updateScore();
      } else {
        this.isPointOver = true;
      }
    }

    this.collideSides();
    this.players.forEach(player => this.collide(player, this.ball));
  }

  updateScore() {
    $("#player1tally").text(pong.players[0].score);
    $("#player2tally").text(pong.players[1].score);
    $("#player1-game-tally").text(pong.players[0].game);
    $("#player2-game-tally").text(pong.players[1].game);
  }

  collideSides() {
    if (this.ball.top < 0) {
      this.ball.velocity.y = -this.ball.velocity.y;
      this.ball.position.y = this.ballHeight / 2;
    }

    if (this.ball.bottom > this._canvas.height) {
      this.ball.velocity.y = -this.ball.velocity.y;
      this.ball.position.y = this._canvas.height - this.ballHeight / 2;
    }
  }

  botJS() {
    if (this.ball.position.y <= this.players[1].position.y) {
      this.players[1].position.y -= this.botSpeed;
    } else {
      this.players[1].position.y += this.botSpeed;
    }
  }

  botUpdate(move) {
    this.repeatActionCountBot += 1;
    if (move === true) {
      if (this.players[1].position.y - this.botSpeed >= 0) {
        this.players[1].position.y -= this.botSpeed;
      }
    } else {
      if (this.players[1].position.y + this.botSpeed <= this._canvas.height) {
        this.players[1].position.y += this.botSpeed;
      }
    }
  }

  trainingOpponentMove(move) {
    this.repeatActionCountTrainingOpponent += 1;
    if (move === false) {
      this.players[0].position.y += this.botSpeed;
    } else {
      this.players[0].position.y -= this.botSpeed;
    }
  }
}

class Game {
  constructor(pong) {
    this.pong = pong;
  }

  keyboard() {
    window.addEventListener("keydown", keyboardHandlerFunction);
    function keyboardHandlerFunction(e) {
      var humanSpeed = 30;
      if (
        e.keyCode === 40 &&
        pong.players[0].position.y < pong._canvas.height - humanSpeed
      ) {
        pong.players[0].position.y += humanSpeed;
      } else if (e.keyCode === 38 && pong.players[0].position.y > humanSpeed) {
        pong.players[0].position.y -= humanSpeed;
      }
    }
  }
}

const canvas = document.getElementById("pong");
const pong = new Pong(canvas);
const game = new Game(pong);
game.keyboard();
