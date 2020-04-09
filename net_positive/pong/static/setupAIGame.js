"use strict";

const canvas = document.getElementById('pong');
const imageProcessor = new ImageProcessor;
const ballWidth = 4;
const ballHeight = 8;
const serveSpeed = 200;
const ball = new Ball(ballWidth, ballHeight, serveSpeed);
const paddleWidth = 8;
const paddleHeight = 32;
const paddleOffsetStart = 36;
const player1 = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
const player2 = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
const pong = new Pong(canvas, imageProcessor, ball, player1, player2);
const botSocket = new BotSocket('ws://' + window.location.host + '/ws/pong/', player1, player2);
const keyboardInput = new KeyboardInput(pong);