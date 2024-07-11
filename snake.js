const GRID_SIZE = 20;
const GAME_SPEED = 100;

class SnakeGame {
    constructor() {
        this.gameArena = document.getElementById('game-arena');
        this.startButton = document.getElementById('start-game');
        this.scoreElement = document.getElementById('score');
        this.grid = [];
        this.snake = [];
        this.direction = 'right';
        this.food = null;
        this.score = 0;
        this.gameLoop = null;

        this.initializeGrid();
        this.addEventListeners();
    }

    initializeGrid() {
        this.gameArena.innerHTML = '';
        for (let i = 0; i < GRID_SIZE; i++) {
            this.grid[i] = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'absolute bg-[#2a3441] border border-[#3a4451]';
                cell.style.width = `${100 / GRID_SIZE}%`;
                cell.style.height = `${100 / GRID_SIZE}%`;
                cell.style.left = `${j * (100 / GRID_SIZE)}%`;
                cell.style.top = `${i * (100 / GRID_SIZE)}%`;
                this.gameArena.appendChild(cell);
                this.grid[i][j] = cell;
            }
        }
    }

    addEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startGame() {
        this.snake = [{x: 10, y: 10}];
        this.direction = 'right';
        this.score = 0;
        this.updateScore();
        this.generateFood();
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.gameStep(), GAME_SPEED);
        this.startButton.textContent = 'Restart Game';
    }

    gameStep() {
        const head = {...this.snake[0]};
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (this.checkCollision(head)) {
            this.endGame();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
        } else {
            this.snake.pop();
        }

        this.updateGrid();
    }

    checkCollision(head) {
        return head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    updateGrid() {
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                this.grid[i][j].className = 'absolute bg-[#2a3441] border border-[#3a4451]';
            }
        }

        this.snake.forEach((segment, index) => {
            this.grid[segment.y][segment.x].classList.add(index === 0 ? 'bg-green-500' : 'bg-green-300');
        });

        this.grid[this.food.y][this.food.x].classList.add('bg-red-500');
    }

    handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowUp': if (this.direction !== 'down') this.direction = 'up'; break;
            case 'ArrowDown': if (this.direction !== 'up') this.direction = 'down'; break;
            case 'ArrowLeft': if (this.direction !== 'right') this.direction = 'left'; break;
            case 'ArrowRight': if (this.direction !== 'left') this.direction = 'right'; break;
        }
    }

    updateScore() {
        this.scoreElement.textContent = `Score: ${this.score}`;
    }

    endGame() {
        clearInterval(this.gameLoop);
        this.showMessage('Game Over!');
    }

    showMessage(message) {
        const modal = document.createElement('div');
        modal.className = 'absolute inset-0 flex items-center justify-center bg-black bg-opacity-50';
        modal.innerHTML = `
            <div class="bg-[#2a3441] p-4 rounded shadow-lg">
                <p class="text-xl font-bold mb-2">${message}</p>
                <p>Your score: ${this.score}</p>
            </div>
        `;
        this.gameArena.appendChild(modal);
        setTimeout(() => modal.remove(), 3000);
    }
}

new SnakeGame();