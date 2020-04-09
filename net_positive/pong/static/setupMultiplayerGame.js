"use strict";

const canvas = document.getElementById('pong');
const imageProcessor = 'dummyImageProcessor'
const ballWidth = 4;
const ballHeight = 8; 
const serveSpeed = 300;
const ball = new Ball(ballWidth, ballHeight, serveSpeed);
const paddleWidth = 10;
const paddleHeight = 50;
const paddleOffsetStart = 32;
const player1 = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
const player2 = new Player(paddleWidth, paddleHeight, paddleOffsetStart);
const pong = new Pong(canvas, imageProcessor, ball, player1, player2);
const botSocket = 'dummyBotSocket';
const keyboardInput = new KeyboardInput(pong);