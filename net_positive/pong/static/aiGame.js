"use strict";

class Vector
  {
    constructor(x = 0, y = 0)
    {
      this.x = x;
      this.y = y;
    }
    get length()
    {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    set length(value)
    {
      const factor = value / this.length;
      this.x *= factor;
      this.y *= factor;
    }
  }

  class Rectangle
  {
    constructor(w, h)
    {
      this.position = new Vector;
      this.size = new Vector(w, h);
    }
    get left()
    {
      return this.position.x - this.size.x / 2;
    }
    get right()
    {
      return this.position.x + this.size.x / 2;
    }
    get top()
    {
      return this.position.y - this.size.y / 2;
    }
    get bottom()
    {
      return this.position.y + this.size.y / 2;
    }
  }

  class Ball extends Rectangle
  {
    constructor()
    {
      super(4, 8);
      this.velocity = new Vector;
    }
  }

  class Player extends Rectangle 
  {
    constructor()
    {
      super(8, 32);
      this.score = 0;
      this.game = 0;
      this.velocity = new Vector;
    }
  }

  class Pong
  {
    constructor(canvas)
    {
      var trainingSession = "training";
    
      this.BotSocket = new WebSocket(
          'ws://' + window.location.host +
          '/ws/pong/' + trainingSession + '/');

      var that = this
      this.BotSocket.onmessage = function(e) {
          var data = JSON.parse(e.data);
          that.repeatActionCount = 0;
          var move = data['move'];
          var trainingopponent = data['trainingopponent']
          if (trainingopponent === "false"){
            that._moveup = move;
            that.responseReceived = true;}
          else { 
            that.trainingOpponentMove(move) }
      };

      this.BotSocket.onclose = function(e) {
          console.error('Chat socket closed unexpectedly');
      };

      this._moveup = '';
      this._canvas = canvas;
      this._context = canvas.getContext('2d');
      this.repeatActionCount = 0;

      this.ball = new Ball;
      this.throttle = 1;
      this.gameCount = 0;

      this.done = false;

      this.training = false;
      this.bot = 'rl-federer';

      this.isPointOver = false;

      this.aggregateReward = 0;

      this.responseReceived = true;

    
      this.players = [
        new Player,
        new Player,
      ];

      this.players[0].position.x = 36;
      this.players[1].position.x = this._canvas.width - 36;
      this.players.forEach( player => { player.position.y = this._canvas.height / 2 });

      let lastTime;
      this.count = 99;
      const callback = (milliseconds) => {
        if (lastTime) {
          this.update((milliseconds - lastTime) / 1000);
          this.updateReward();
          if (this.repeatActionCount<3){
            this.botUpdate(this._moveup);
            this.repeatActionCount += 1;
          }
          else {
            this.repeatActionCount = 0;
          }
    
          if (this.isPointOver === true) {
            this.reset();
          }
          this.draw();
        }
        
        lastTime = milliseconds;
        requestAnimationFrame(callback);
        
        this.count += 1;
        
        if (this.BotSocket.readyState === 1) {
          if ((this.responseReceived === true) && (this.count % this.throttle === 0)) {
            // this.draw();
            // uncomment the above line to see what the bot is seeing
            this.responseReceived = false;
            this.getMoveWS()
            if( this.training === true ){
              this.getOpponentMove() 
            }
            if (this.isPointOver === true) {
              this.gameCount += 1;
              this.aggregateReward = 0;
              this.isPointOver = false;
            }
          }
        }
        
      }
      callback();
      this.reset();
    }

    getMoveWS(){

      var image = this._context.getImageData(0, 0, 320, 320);
      
      var imageArray = Array.from(image.data)
    
      imageArray = imageArray.filter(function(_, i) {
        return (i + 1) % 4;
      })
      imageArray = imageArray.filter(function(_, i) {
        return (i + 1) % 3;
      })
      imageArray = imageArray.filter(function(_, i) {
        return (i + 1) % 2;
      
      })
      
      var everyOtherTime = 0

      for (var i = 0, len = imageArray.length; i < len; i++) {
        if (imageArray[i] < 127.5) {
          imageArray[i] = 0;
        }
        else if (imageArray[i] == 127.5)
        {
          if (everyOtherTime % 2 == 0) {

            imageArray[i] = 1;
            everyotherTime += 1;
          }
        }
        else {
          imageArray[i] = 1;
        }
      }

      var imageString = imageArray.join('')

      // compress pixel data
      var regex80 = /00000000000000000000000000000000000000000000000000000000000000000000000000000000/gi
      var regex40 = /0000000000000000000000000000000000000000/gi
      var regex20 = /00000000000000000000/gi
      var regex10 = /0000000000/gi
      var regex4 = /1111/gi
      imageString = imageString.replace(regex80, 'w');
      imageString = imageString.replace(regex40, 'x');
      imageString = imageString.replace(regex20, 'y');
      imageString = imageString.replace(regex10, 'z');
      imageString = imageString.replace(regex4, 'a');
      // compress it some more
      var regexW = /wwwwwwwwwwwwwwwwwwww/gi
      imageString = imageString.replace(regexW, 'v');

   
      var bally = Math.round(this.ball.position.y);
      var paddley = this.players[1].position.y;
      var reward = this.aggregateReward;
      var court = `{"bally": ${bally}, "paddley": ${paddley}, "reward": ${reward}}`;
        
      this.BotSocket.send(JSON.stringify({
        "court": court,
        "image": imageString,
        "done": this.done,
        "bot": this.bot,
        "trainingopponent": "false"
        }));

      court = '';
      this.done = false;
    }

    getOpponentMove(){
      var bally = Math.round(this.ball.position.y);
      var paddley = this.players[0].position.y;
      var court = `{"bally": ${bally}, "paddley":${paddley}, "reward": "dummy"}`;

      this.BotSocket.send(JSON.stringify({
        "court": court,
        "done": "dummy",
        "image": "dummy",
        "bot": "nodevak-djokovic",
        "trainingopponent": "true"
        }));

      court = '';
    }

    collide(player, ball) {
      if (player.left <= ball.right && player.right >= ball.left && player.top <= ball.bottom && player.bottom >= ball.top) {
        const length = ball.velocity.length

        if (ball.position.x > 160) {
          ball.position.x -=  9
        }
        else {
          ball.position.x +=  9
        }


        ball.velocity.x = -ball.velocity.x;
        ball.velocity.y += ball.velocity.y * (Math.random() - .5);

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
      this._context.fillStyle = '#000';
      this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
      this.drawRectangle(this.ball);
      this.players.forEach(player => this.drawRectangle(player))
    }

    drawRectangle(rectangle) {
      this._context.fillStyle = '#fff';
      this._context.fillRect(rectangle.left, rectangle.top, rectangle.size.x, rectangle.size.y);
    }

    reset() {
      this.ball.position.x = this._canvas.width / 2;
      this.ball.position.y = this._canvas.height / 2;
      this.ball.velocity.x = 0;
      this.ball.velocity.y = 0;
      this.players[0].position.y = this._canvas.height / 2;
      this.players[1].position.y = this._canvas.height / 2;

      if (this.players[0].score < 21 && this.players[1].score < 21){
        this.start()    
      } else {
        this.done = true
        this.restartGame(); 
      }
    }

    start() {
      if (this.ball.velocity.x === 0 && this.ball.velocity.y === 0) {
        this.ball.velocity.x = 300 * (Math.random() > .5 ? 1 : -1);
        this.ball.velocity.y = 300 * (Math.random() > .5 ? 1 : -1);
        this.ball.velocity.length = 200;
      }
    }

    restartGame() {
        var playerId
        if (this.players[1].score === 21) {
          playerId = 1;
        } else {
          playerId = 0;
        }
        this.players[playerId].game += 1
        this.players[0].score = 0;
        this.players[1].score = 0;
        this.start();
    }

    updateReward() {
      if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
        if (this.ball.velocity.x < 0) {
          this.aggregateReward += 1
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
        } else {
          playerId = 0;
          this.isPointOver = true;
        }
        this.players[playerId].score++;
      }
      $(document).ready(function(){
    
        updateScore()
  
        function updateScore(){
        
          $("#player1tally").text(
            pong.players[0].score
          )
          $("#player2tally").text(
            pong.players[1].score
          )
          $("#player1-game-tally").text(
            pong.players[0].game
          )
          $("#player2-game-tally").text(
            pong.players[1].game
          )
        }
      })
    
      

      if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
        this.ball.velocity.y = -this.ball.velocity.y;
      }
      this.players.forEach(player => this.collide(player, this.ball));
    }

    botJS() {
      if (this.ball.position.y <= this.players[1].position.y) {
        this.players[1].position.y -= 20
      } else  {
        this.players[1].position.y += 20
      }
    }

    botUpdate(moveUp) {
      if(moveUp === true) {
        if (this.players[1].position.y - 12 >= 0) {
          this.players[1].position.y -= 12
        }
        else {
          this.players[1].position.y = this.players[1].position.y
        }
      } 
      else {
        if (this.players[1].position.y + 12 <= 320) {
          this.players[1].position.y += 12
        }
        else {
          this.players[1].position.y = this.players[1].position.y
        }
      }
    }

    trainingOpponentMove(move) {
      if (move === false){
        this.players[0].position.y += 17
    
      }
      else {
        this.players[0].position.y -= 17
      }
    }



  }


  const canvas = document.getElementById('pong');
  const pong = new Pong(canvas);

  class Game {

    constructor(pong) 
    {
      this.pong = pong;
    }


    keyboard(){
      window.addEventListener('keydown', keyboardHandlerFunction); 
      function keyboardHandlerFunction(e) {
        if(e.keyCode === 40 && pong.players[0].position.y < (pong._canvas.height - 50) ) {
          pong.players[0].position.y += 30
        } else if(e.keyCode === 38 && pong.players[0].position.y > 50) {
            pong.players[0].position.y -= 30
        }
      }
    }
  }

  const game = new Game(pong);
  game.keyboard();
