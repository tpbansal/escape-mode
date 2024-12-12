const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

const gridSize = 20; // Size of each cell in the maze
const playerSize = gridSize / 2;

// Player and goal positions
let player = { x: 0, y: 0 };
let goal = { x: canvas.width - gridSize, y: canvas.height - gridSize };

// Timer and score
let timeLeft = 30;
let score = 0;

// Variables for touch input
let touchStartX = 0;
let touchStartY = 0;

// Generate maze (simple grid for now)
function drawMaze() {
    ctx.fillStyle = "#444";
    for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.fillRect(x, y, gridSize - 2, gridSize - 2);
        }
    }
}

// Draw player and goal
function drawPlayer() {
    ctx.fillStyle = "#0f0";
    ctx.fillRect(player.x + gridSize / 4, player.y + gridSize / 4, playerSize, playerSize);
}

function drawGoal() {
    ctx.fillStyle = "#f00";
    ctx.fillRect(goal.x + gridSize / 4, goal.y + gridSize / 4, playerSize, playerSize);
}

// Update the game state
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawGoal();
    drawPlayer();
}

// Handle player movement with keyboard
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (player.y > 0) player.y -= gridSize;
            break;
        case "ArrowDown":
            if (player.y < canvas.height - gridSize) player.y += gridSize;
            break;
        case "ArrowLeft":
            if (player.x > 0) player.x -= gridSize;
            break;
        case "ArrowRight":
            if (player.x < canvas.width - gridSize) player.x += gridSize;
            break;
    }
    checkWin();
});

// Handle player movement with touch (mobile/tablet support)
canvas.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, false);

canvas.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    // Determine swipe direction (up, down, left, right)
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Swiping Up
    if (Math.abs(diffY) > Math.abs(diffX) && diffY < 0 && player.y > 0) {
        player.y -= gridSize;
    }
    // Swiping Down
    else if (Math.abs(diffY) > Math.abs(diffX) && diffY > 0 && player.y < canvas.height - gridSize) {
        player.y += gridSize;
    }
    // Swiping Left
    else if (Math.abs(diffX) > Math.abs(diffY) && diffX < 0 && player.x > 0) {
        player.x -= gridSize;
    }
    // Swiping Right
    else if (Math.abs(diffX) > Math.abs(diffY) && diffX > 0 && player.x < canvas.width - gridSize) {
        player.x += gridSize;
    }
    
    checkWin();
}, false);

// Check if the player reached the goal
function checkWin() {
    if (player.x === goal.x && player.y === goal.y) {
        score += 10;
        document.getElementById("score").textContent = `Score: ${score}`;
        resetGame();
    }
}

// Reset player and goal positions
function resetGame() {
    player = { x: 0, y: 0 };
    goal = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
    };
}

// Countdown timer
function startTimer() {
    const timerInterval = setInterval(() => {
        timeLeft -= 1;
        document.getElementById("timer").textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Final Score: " + score);
            resetGame();
            timeLeft = 30;
            score = 0;
            document.getElementById("score").textContent = `Score: ${score}`;
            startTimer();
        }
    }, 1000);
}

// Initialize game
resetGame();
startTimer();
setInterval(updateGame, 100);
