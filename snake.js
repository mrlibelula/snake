const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const foodLeftContainer = document.getElementById('foodLeft');
const gameOverModal = document.getElementById('gameOverModal');
const winModal = document.getElementById('winModal');

const tileCount = 20;
let snake = [{x: 10, y: 10}];
let food = getRandomPosition();
let dx = 0;
let dy = 0;
let foodCount = 10;
let gameLoop;

function initGame() {
    resizeCanvas();
    drawGame();
    updateFoodIndicators();
}

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function drawGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
}

function clearCanvas() {
    ctx.fillStyle = '#2a3447';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = getRandomPosition();
        foodCount--;
        updateFoodIndicators();
        if (foodCount === 0) {
            gameOver(true);
        }
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = '#60a5fa';
    const tileSize = canvas.width / tileCount;
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
        } else {
            ctx.fillRect(segment.x * tileSize + 1, segment.y * tileSize + 1, tileSize - 2, tileSize - 2);
        }
    });
}

function drawFood() {
    ctx.fillStyle = '#22d3ee';
    const tileSize = canvas.width / tileCount;
    ctx.beginPath();
    ctx.arc(
        (food.x + 0.5) * tileSize, 
        (food.y + 0.5) * tileSize, 
        tileSize / 2, 0, 2 * Math.PI
    );
    ctx.fill();
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver(false);
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver(false);
        }
    }
}

function gameOver(won) {
    clearInterval(gameLoop);
    if (won) {
        winModal.style.display = 'block';
    } else {
        gameOverModal.style.display = 'block';
    }
    startButton.disabled = false;
}

function updateFoodIndicators() {
    foodLeftContainer.innerHTML = '';
    for (let i = 0; i < foodCount; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'w-3 h-3 bg-[#22d3ee] rounded-full';
        foodLeftContainer.appendChild(indicator);
    }
}

function changeDirection(e) {
    const key = e.key;
    if (key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
    else if (key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
    else if (key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
    else if (key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
}

function startGame() {
    snake = [{x: 10, y: 10}];
    food = getRandomPosition();
    dx = 0;
    dy = 0;
    foodCount = 10;
    updateFoodIndicators();
    startButton.disabled = true;
    gameOverModal.style.display = 'none';
    winModal.style.display = 'none';
    gameLoop = setInterval(drawGame, 100);
}

function restartGame() {
    gameOverModal.style.display = 'none';
    winModal.style.display = 'none';
    startGame();
}

document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);
window.addEventListener('resize', resizeCanvas);

initGame();