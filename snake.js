// Constants for the game
const blockSize = 25;
const rows = 20;
const cols = 20;

// Variables for the game elements
let board;
let context;

// Snake's initial position and movement
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let velocityX = 0;
let velocityY = 0;

// Array to store snake's body segments
let snakeBody = [];

// Initial food position and game state
let foodX;
let foodY;
let gameOver = false;

var score = 0; // Luo ja alusta pistelaskun muuttuja

// Funktio pistemäärän ja high scoren näyttämiseksi ruudulla
function drawScores() {
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, board.height - 30);
    context.fillText("High score: " + getHighScore(), 10, board.height - 10);
}

// Hae tallennettu high score localStoragesta
function getHighScore() {
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore === null) {
        return 0;
    }
    return parseInt(storedHighScore);
}

// Tallenna high score, jos se on suurempi kuin aiempi tallennettu high score
function saveHighScore() {
    const storedHighScore = getHighScore();
    if (score > storedHighScore) {
        localStorage.setItem("highScore", score);
    }
}


// Function called when the window loads
window.onload = function() {
    initializeGame();
}

// Initialize game parameters
function initializeGame() {
    setupCanvas();
    setStyling();
    addEventListeners();
    placeFood();
    setInterval(update, 100); // Update every 100 milliseconds
}

// Setup game canvas dimensions
function setupCanvas() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");
}

// Set styling for the game elements
function setStyling() {
    document.body.style.backgroundColor = "black";

    board.style.margin = "20px auto";
    board.style.border = "5px solid white";
    board.style.display = "block";

    const heading = document.querySelector("h1");
    heading.style.color = "white";
}

// Add event listeners for key presses
function addEventListeners() {
    document.addEventListener("keyup", changeDirection);
}

// Update the game state
function update() {
    if (gameOver) {
        saveHighScore(); // Tallenna high score pelin päätyttyä
        return;
    }

    clearBoard();
    drawFood();
    handleFoodCollision();
    moveSnake();
    drawSnake();
    checkGameOver();
    drawScores(); // Päivitä pistemäärät joka kierroksella
}


// Clear the game board
function clearBoard() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
}

// Draw the food on the board
function drawFood() {
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);
}

// Check if snake eats the food
function handleFoodCollision() {
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score++; // Lisää pisteen ruokaan osuessa
    }
    
}

// Move the snake
function moveSnake() {
    updateSnakeBody();
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
}

// Update the snake's body segments
function updateSnakeBody() {
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }
}

// Draw the snake on the board
function drawSnake() {
    context.fillStyle = "lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }
}

// Check game over conditions
function checkGameOver() {
    if (
        snakeX < 0 ||
        snakeX >= cols * blockSize || // Muutettu ehtoa tässä
        snakeY < 0 ||
        snakeY >= rows * blockSize || // Muutettu ehtoa tässä
        checkSnakeCollision()
    ) {
        endGame();
    }
}

// Check if the snake collides with itself
function checkSnakeCollision() {
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            return true;
        }
    }
    return false;
}

// End the game
function endGame() {
    gameOver = true;
    saveHighScore(); // Tallenna high score pelin päätyttyä
    alert("Game Over, sait " + score + " pistettä.");
    window.location.reload(); // Lataa sivu uudelleen pelin alkutilaan
}

// Handle changing the snake's direction
function changeDirection(e) {
    if (e.code === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Place food at random positions
function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}