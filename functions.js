var width = window.innerWidth;
var height = window.innerHeight;
const size = 3000;
const playersize = 75;
const ammosize = 37.5;
const ratio = size / 500;

function random(number1, number2){
  return Math.round(Math.random() * (number2 - number1)) + number1;
}

function checkMovement(direction, x, y){
  return true;
}

export { width, height, size, playersize, ammosize, ratio, random, checkMovement }