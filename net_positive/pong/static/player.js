"use strict";

class Player extends Rectangle {
  constructor(w, h, paddleOffsetStart) {
    super(w, h);
    this.score = 0;
    this.game = 0;
    this.botSpeed = 12;
    this.humanSpeed = 40;
    this.velocity = new Vector;
    this.repeatActionCount = 0;
    this._moveUpBot = '';
    this.responseReceived = true;
    this.paddleOffsetStart = paddleOffsetStart;
  }

  storeMove(move) {
    this._moveUpBot = move;
    this.responseReceived = true;
    this.repeatActionCount = 0;
  }

  botMove(canvasHeight) {
    this.repeatActionCount++;
    this._moveUpBot ? this.moveUp(this.botSpeed) : this.moveDown(this.botSpeed, canvasHeight);
  }

  humanMove(canvasHeight, moveUpHuman) {
    moveUpHuman ? this.moveUp(this.humanSpeed) : this.moveDown(this.humanSpeed, canvasHeight);
  }

  moveUp(moveSpeed) {
    if (this.isMoveInCourtTop(moveSpeed)) {
      this.position.y -= moveSpeed;
    }
  }

  moveDown(moveSpeed, canvasHeight) {
    if (this.isMoveInCourtBottom(moveSpeed, canvasHeight)) {
      this.position.y += moveSpeed;
    }
  }

  isMoveInCourtTop(moveSpeed) {
    return this.position.y >= moveSpeed;
  }

  isMoveInCourtBottom(moveSpeed, canvasHeight) {
    return this.position.y + moveSpeed <= canvasHeight;
  }

  resetPosition(canvasHeight) {
    this.position.y = canvasHeight / 2;
  }
}
