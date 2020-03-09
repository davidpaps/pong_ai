'use strict';


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
    super(10, 10);
    this.velocity = new Vector;
  }
}

class Player extends Rectangle 
{
  constructor()
  {
    super(20 , 100);
    this.score = 0;
    this.game = 0;
    this.velocity = new Vector;
  }
}

class Pong
{
  constructor(canvas)
  {
    this._move = "";
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this.pixelData = this._context.getImageData(0, 0, 600, 400);
    
    // console.log(this.pixelData);
   


    this.ball = new Ball;
    this.throttle = 1;
    this.gameCount = 0;

    this.done = false;

    this.isPointOver = false;

    this.aggregateReward = 0;

    this.responseReceived = true;
  

    this.players = [
      new Player,
      new Player,
    ];

    this.players[0].position.x = 20;
    this.players[1].position.x = this._canvas.width - 20;
    this.players.forEach( player => { player.position.y = this._canvas.height / 2 });


    let lastTime;
    this.count = 99;
    const callback = (milliseconds) => {
      if (lastTime) {
        this.update((milliseconds - lastTime) / 1000);
        this.updateReward();
        if (this.isPointOver === true) {
          this.reset();
        }
        this.draw();
      }
      
      lastTime = milliseconds;
      requestAnimationFrame(callback);
      
      
      this.count += 1;
      // console.log(this.responseReceived);
     
      if ((this.responseReceived === true) && (this.count % this.throttle === 0)) {
        // this.draw();
        // uncomment the above line to see what the bot is seeing
        this.responseReceived = false;
       
        this.getMove(this.count);
        if (this.isPointOver === true) {
          this.gameCount += 1;
          this.aggregateReward = 0;
          this.isPointOver = false;
        }
      }
      
      
    }
    callback();
    this.reset();
  }

  getMove(){
    // console.log(this.count);
    // var d = new Date
    // console.log(d.getSeconds())
    // console.log(d.getMilliseconds())
    var image = 'placeholder'
    let url = `http://localhost:8000/pong/bot?&bally=${Math.round(this.ball.position.y)}&paddley=${this.players[1].position.y}&reward=${this.aggregateReward}&img=${image}`
    // let url = `http://net-positive.herokuapp.com/pong/bot?bally=${Math.round(this.ball.position.y)}&paddley=${this.players[1].position.y}&reward=${this.aggregateReward}&img=${image}`
    var that = this
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        that._move = myArr['up'];
        that.botUpdate(that._move);
        that.responseReceived = true;
      }
    };
    xmlhttp.open('GET', url, true);

    xmlhttp.send();
    
  }

  collide(player, ball) {
    if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
      const length = ball.velocity.length
      ball.velocity.x = -ball.velocity.x;
      ball.velocity.y += 300 * (Math.random() - .5);
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

    // console.log(`Player 1 Score: ${this.players[0].score} Player 2 Score: ${this.players[1].score}`)

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
      this.ball.velocity.y = 300 * (Math.random() * 2 -1);
      this.ball.velocity.length = 2000;
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
      // console.log(`Player 1 Game: ${this.players[0].game} Player 2 Game: ${this.players[1].game}`)
      this.players[0].score = 0;
      this.players[1].score = 0;
      this.done = false;
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
  }
  
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
        this.players[1].position.y -= 20
    } else {
        this.players[1].position.y += 20
    }
  }

}


const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

class Game {

  constructor(pong) 
  {
    this.pong = pong;
    this.playerVsAi = true;
    this.playerVsPlayer = false;
    this.player1Mouse = false;
    this.player2Mouse = false;
  }

  controls(){ 

    if (this.playerVsAi && this.player1Mouse) {
      this.mouse(0);
      // bot
    } else if (this.playerVsAi) {
      this.keyboard(0);
      // bot
    } else if (this.playerVsPlayer && this.player2Mouse) {
      this.mouse(1);
      this.keyboard(0);
    } else if (this.playerVsPlayer && this.player1Mouse) {
      this.mouse(0);
      this.keyboard(1);
    } else if (this.playerVsPlayer) {
      this.keyboardPlayerPlayer();
      this.keyboard(1);
    }
  }

  mouse(player){
    canvas.addEventListener('mousemove', event => {
    pong.players[player].position.y = event.offsetY;
    })
  }

  keyboard(player){
    window.addEventListener('keydown', keyboardHandlerFunction); 

    function keyboardHandlerFunction(e) {
      if(e.keyCode === 40 && pong.players[player].position.y < (pong._canvas.height - 50) ) {
        pong.players[player].position.y += 25
      }
      else if(e.keyCode === 38 && pong.players[player].position.y > 50) {
          pong.players[player].position.y -= 25
      }  
      else if(e.keyCode === 32) {
        pong.start();
      } 
    }
  }

  keyboardPlayerPlayer(){
    window.addEventListener('keydown', keyboardHandlerFunction); 

    function keyboardHandlerFunction(e) {

      if(e.keyCode === 83 && pong.players[0].position.y < (pong._canvas.height - 50) ) {
        pong.players[0].position.y += 25
      }
      else if(e.keyCode === 87 && pong.players[0].position.y > 50) {
          pong.players[0].position.y -= 25
      }  
    }
  }
}

const game = new Game(pong);
game.controls();
