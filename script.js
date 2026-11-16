
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

const size = 20;
const cells = canvas.width / size;

let snake;
let food;
let direction;
let nextDirection;
let score;
let running;
let timer;

function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;

    scoreElement.textContent = score;
    food = createFood();
    running = true;

    message.textContent = "Use arrow keys to move!";
    startBtn.textContent = "Restart Game";

    clearInterval(timer);
    draw();
    timer = setInterval(update, 120);
}

function createFood() {
    let position;

    do {
        position = {
            x: Math.floor(Math.random() * cells),
            y: Math.floor(Math.random() * cells)
        };
    } while (snake.some(part =>
        part.x === position.x && part.y === position.y
    ));

    return position;
}

function update() {
    if (!running) return;

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    const ateFood =
        head.x === food.x && head.y === food.y;

    const body = ateFood ? snake : snake.slice(0, -1);

    const hitWall =
        head.x < 0 || head.x >= cells ||
        head.y < 0 || head.y >= cells;

    const hitBody = body.some(part =>
        part.x === head.x && part.y === head.y
    );

    if (hitWall || hitBody) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (ateFood) {
        score += 10;
        scoreElement.textContent = score;
        food = createFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(
        food.x * size,
        food.y * size,
        size - 2,
        size - 2
    );

    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#86efac" : "#22c55e";

        ctx.fillRect(
            part.x * size,
            part.y * size,
            size - 2,
            size - 2
        );
    });
}

function endGame() {
    running = false;
    clearInterval(timer);
    message.textContent = `Game Over! Final score: ${score}`;
}

document.addEventListener("keydown", event => {
    const keys = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };

    const newDirection = keys[event.key];

    if (!newDirection || !running) return;

    event.preventDefault();

    if (
        newDirection.x !== -direction.x ||
        newDirection.y !== -direction.y
    ) {
        nextDirection = newDirection;
    }
});

startBtn.addEventListener("click", resetGame);

draw();
