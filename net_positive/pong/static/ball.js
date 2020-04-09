"use strict";

class Ball extends Rectangle {
  constructor(w, h, serveSpeed) {
    super(w, h);
    this.velocity = new Vector;
    this.serveSpeed = serveSpeed;
    this.reboundSpeed = 1.05;
  }

  resetPosition(canvasWidth, canvasHeight) {
    this.position.x = canvasWidth / 2;
    this.position.y = canvasHeight / 2;
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  updatePosition(deltatime) {
    this.position.x += this.velocity.x * deltatime;
    this.position.y += this.velocity.y * deltatime;
  }

  isOutOfPlay(canvasWidth) {
    return this.left < 0 || this.right > canvasWidth;
  }

  serve() {
    this.velocity.x = (Math.random() > .5 ? 1 : -1);
    this.velocity.y = (Math.random() > .5 ? 1 : -1);
    this.velocity.length = this.serveSpeed;
  }

  collideTop() {
    if (this.top < 0) {
      this.velocity.y = -this.velocity.y;
      this.position.y = this.size.y/2;
    }
  }

  collideBottom(canvasHeight) {
    if (this.bottom > canvasHeight) {
      this.velocity.y = -this.velocity.y;
      this.position.y = canvasHeight - this.size.y/2;
    }
  }

  collideLeftPaddle(player) {
    if (this.isPaddleHit(player)) {
      this.position.x = player.paddleOffsetStart + player.size.x/2;
      this.paddleBounce();
    }
  }

  collideRightPaddle(player, canvasWidth) {
    if (this.isPaddleHit(player)) {
      this.position.x = canvasWidth - player.paddleOffsetStart - player.size.x/2;
      this.paddleBounce();
    }
  }

  isPaddleHit(player) {
    return player.left <= this.right && player.right >= this.left && player.top <= this.bottom && player.bottom >= this.top;
  }

  paddleBounce() {
    this.velocity.x = -this.velocity.x;
    this.velocity.y += this.velocity.y * (Math.random() - 0.5);
    this.velocity.length *= this.reboundSpeed; 
  }
}