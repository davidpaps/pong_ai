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
    console.log("Constructor")
    this._move = "";
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this.pixelData = this._context.getImageData(0, 0, 600, 400);
    // console.log(this.pixelData);

    this.ball = new Ball;

    this.done = false;

    this.reward = 0;

    this.players = [
      new Player,
      new Player,
    ];

    this.players[0].position.x = 20;
    this.players[1].position.x = this._canvas.width - 20;
    this.players.forEach( player => { player.position.y = this._canvas.height /2 });


   let lastTime;
   const callback = (milliseconds) => {
    console.log("callback")
      if (lastTime) {
        this.update((milliseconds - lastTime) / 1000);
      }
      lastTime = milliseconds;
      requestAnimationFrame(callback);
    }
    callback();
    this.reset();
  }
  getMove(){
    let url = `http://localhost:8000/pong/bot?ballx=${this.ball.position.x}&bally=${this.ball.position.y}&paddley=${this.players[1].position.y}`
    var that = this
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        that._move = myArr['up']
     }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  }

  collide(player, ball) {
    console.log("collide")
    if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
      const length = ball.velocity.length
      ball.velocity.x = -ball.velocity.x;
      ball.velocity.y += 300 * (Math.random() - .5);
      ball.velocity.length = length * 1.1; 
    }
  }

  draw() {
    console.log("draw")
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawRectangle(this.ball);
    this.players.forEach(player => this.drawRectangle(player))
  }

  drawRectangle(rectangle) {
    console.log("drawRectangle")
    this._context.fillStyle = '#fff';
    this._context.fillRect(rectangle.left, rectangle.top, rectangle.size.x, rectangle.size.y);
  }

  reset() {
    console.log("reset")
    this.ball.position.x = this._canvas.width / 2;
    this.ball.position.y = this._canvas.height / 2;
    this.ball.velocity.x = 0;
    this.ball.velocity.y = 0;
    this.players[0].position.y = this._canvas.height / 2;
    this.players[1].position.y = this._canvas.height / 2;
    this.reward = 0;

    // console.log(`Player 1 Score: ${this.players[0].score} Player 2 Score: ${this.players[1].score}`)

      if (this.players[0].score < 21 && this.players[1].score < 21){
        this.start()    
      } else {
        this.done = true
        // console.log(this.done)
        // console.log(this.pixelData)
        this.restartGame(); 
      }
  }

  start() {
    console.log("start")
    if (this.ball.velocity.x === 0 && this.ball.velocity.y === 0) {
      this.ball.velocity.x = 300 * (Math.random() > .5 ? 1 : -1);
      this.ball.velocity.y = 300 * (Math.random() * 2 -1);
      this.ball.velocity.length = 300
    }
  }

  restartGame() {
    console.log("restartGame")
      var playerId
      if (this.players[1].score === 21) {
        playerId = 1
      } else {
        playerId = 0
      }
      this.players[playerId].game += 1
      // console.log(`Player 1 Game: ${this.players[0].game} Player 2 Game: ${this.players[1].game}`)
      this.players[0].score = 0;
      this.players[1].score = 0;
      this.done = false;
      this.start();
  }

  update(deltatime) {
    console.log("update")
    this.ball.position.x += this.ball.velocity.x * deltatime;
    this.ball.position.y += this.ball.velocity.y * deltatime;
 
  
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      var playerId;
      if (this.ball.velocity.x < 0) {
        playerId = 1;
        this.reward = 1;
      } else {
        playerId = 0;
        this.reward = -1;
      }
      
      this.players[playerId].score++;
      // console.log(this.reward)
      
      this.reset();
    }
  
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.velocity.y = -this.ball.velocity.y
    }

  // bot lvl 10
  // this.players[1].position.y = this.ball.position.y

  // bot lvl 5
  if (this.ball.position.y > this.players[1].position.y && this.players[1].position.y < (this._canvas.height - 50)) {
    this.players[1].position.y += 10;
  } 
  if (this.ball.position.y < this.players[1].position.y && this.players[0].position.y > 50) {
    this.players[1].position.y -= 10;
  }
    
  this.players.forEach(player => this.collide(player, this.ball))

  // console.log(this.reward)
  this.draw();

  }
}
const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

window.addEventListener('keydown', keyboardHandlerFunction);  

function keyboardHandlerFunction(e) {
  if(e.keyCode === 40 && pong.players[0].position.y < (pong._canvas.height - 50) ) {
    pong.players[0].position.y += 25
  }
  else if(e.keyCode === 38 && pong.players[0].position.y > 50) {
      pong.players[0].position.y -= 25
  }  
  else if(e.keyCode === 32) {
    pong.start();
  } 
}

// // player vs player controls
// function keyboardHandlerFunction(e) {

//   if(e.keyCode === 83 && pong.players[0].position.y < (pong._canvas.height - 50) ) {
//     pong.players[0].position.y += 25
//   }
//   else if(e.keyCode === 87 && pong.players[0].position.y > 50) {
//       pong.players[0].position.y -= 25
//   }  
//   else if(e.keyCode === 40 && pong.players[1].position.y < (pong._canvas.height - 50)) {
//     pong.players[1].position.y += 25
//   }  
//   else if(e.keyCode === 38 && pong.players[1].position.y > 50) {
//     pong.players[1].position.y -= 25
//   }  
// }

// mouse controls
// canvas.addEventListener('mousemove', event => {
//   pong.players[0].position.y = event.offsetY;
// })


class Game {
  constructor(pong) {
    this.pong = pong
  }
}