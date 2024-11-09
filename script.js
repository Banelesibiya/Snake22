const boardSize = 20;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let level = 1;
let speed = 200;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;
let isPaused = false;

const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const levelDisplay = document.getElementById("level");
const gameOverDisplay = document.getElementById("game-over");

document.addEventListener("keydown", handleDirectionChange);
highScoreDisplay.innerText = highScore;

function startGame() {
  gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
  if (isPaused) return;

  moveSnake();
  if (checkCollision()) {
    gameOver();
    return;
  }
  if (checkFood()) {
    score++;
    scoreDisplay.innerText = score;
    placeFood();
    increaseSpeed();
    updateHighScore();
  }
  updateBoard();
}

function moveSnake() {
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };
  snake.unshift(newHead);
  snake.pop();
}

function handleDirectionChange(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}

function checkCollision() {
  const head = snake[0];
  return (
    head.x < 0 ||
    head.x >= boardSize ||
    head.y < 0 ||
    head.y >= boardSize ||
    snake.slice(1).some(part => part.x === head.x && part.y === head.y)
  );
}

function checkFood() {
  const head = snake[0];
  if (head.x === food.x && head.y === food.y) {
    snake.push({ ...snake[snake.length - 1] });
    return true;
  }
  return false;
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  };
}

function updateBoard() {
  gameBoard.innerHTML = "";
  snake.forEach(part => {
    const snakePart = document.createElement("div");
    snakePart.style.gridRowStart = part.y + 1;
    snakePart.style.gridColumnStart = part.x + 1;
    snakePart.classList.add("snake");
    gameBoard.appendChild(snakePart);
  });
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y + 1;
  foodElement.style.gridColumnStart = food.x + 1;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

function increaseSpeed() {
  if (score % 5 === 0) {
    level++;
    levelDisplay.innerText = level;
    clearInterval(gameInterval);
    speed -= 10;
    startGame();
  }
}

function gameOver() {
  clearInterval(gameInterval);
  gameOverDisplay.style.display = "block";
  setTimeout(() => gameOverDisplay.style.display = "none", 2000);
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  speed = 200;
  level = 1;
  startGame();
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.innerText = highScore;
  }
}

function togglePause() {
  isPaused = !isPaused;
}

function resetGame() {
  gameOver();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function openSettings() {
  document.getElementById("settings-menu").classList.remove("hidden");
}

function closeSettings() {
  document.getElementById("settings-menu").classList.add("hidden");
}

startGame();