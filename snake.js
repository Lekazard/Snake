// Pelin vakiot
const blockSize = 25;
const rows = 20;
const cols = 20;

// Äänet peliin
const gulpSound = new Audio("gulp.mp3");
const gameOverSound = new Audio("game-over.mp3");

// Ääniefekti ruoan syönnille
function playGulpSound() {
    gulpSound.play();
}

// Pelielementtien muuttujat
let board;
let context;

// Alustetaan käärmeen alkusijainti ja liike
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let velocityX = 0;
let velocityY = 0;

let snakeBody = [];

let foodX;
let foodY;
let gameOver = false;

var score = 0; // Pisteiden laskeminen

// Näytä pisteet ruudulla
function drawScores() {
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, board.height - 30);
    context.fillText("High score: " + getHighScore(), 10, board.height - 10);
}

// Hae tallennettu korkein pistemäärä
function getHighScore() {
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore === null) {
        return 0;
    }
    return parseInt(storedHighScore);
}

// Tallenna korkein pistemäärä
function saveHighScore() {
    const storedHighScore = getHighScore();
    if (score > storedHighScore) {
        localStorage.setItem("highScore", score);
    }
}

// Aseta peli kun sivu latautuu
window.onload = function() {
    initializeGame();
}

// Alusta peli
function initializeGame() {
    setupCanvas();
    setStyling();
    addEventListeners();
    placeFood();
    setInterval(update, 100); // Päivitä joka 100 millisekunti
}

// Aseta pelialueen mitat
function setupCanvas() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");
}

// Aseta tyyli pelielementeille
function setStyling() {
    document.body.style.backgroundColor = "black";

    board.style.margin = "20px auto";
    board.style.border = "5px solid white";
    board.style.display = "block";

    const heading = document.querySelector("h1");
    heading.style.color = "white";
}

// Lisää näppäinpainikkeille tapahtumakuuntelijat
function addEventListeners() {
    document.addEventListener("keyup", changeDirection);
}

// Päivitä pelitila
function update() {
    if (gameOver) {
        saveHighScore();
        return;
    }

    clearBoard();
    drawFood();
    handleFoodCollision();
    moveSnake();
    drawSnake();
    checkGameOver();
    drawScores();
}

// Tyhjennä pelilauta
function clearBoard() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
}

// Piirrä ruoka pelilaudalle
function drawFood() {
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);
}

// Tarkista, syökö käärme ruoan
function handleFoodCollision() {
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score++;
        playGulpSound(); // Toista ääniefekti ruoan syönnin yhteydessä
    }
}

// Liikuta käärmettä
function moveSnake() {
    updateSnakeBody();
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
}

// Päivitä käärmeen ruumiinosat
function updateSnakeBody() {
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }
}

// Piirrä käärme laudalle
function drawSnake() {
    context.fillStyle = "lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }
}

// Tarkista pelin loppumisehdot
function checkGameOver() {
    if (
        snakeX < 0 ||
        snakeX >= cols * blockSize ||
        snakeY < 0 ||
        snakeY >= rows * blockSize ||
        checkSnakeCollision()
    ) {
        endGame();
    }
}

// Tarkista, törmääkö käärme itseensä
function checkSnakeCollision() {
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            return true;
        }
    }
    return false;
}

// Peli päättyy
function endGame() {
    gameOver = true;
    saveHighScore();
    gameOverSound.play(); // Toista ääniefekti pelin päätyttyä
    alert("Game Over, sait " + score + " pistettä.");
    window.location.reload();
}

// Käsittele käärmeen liikkeen muutos
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

// Aseta ruoka satunnaisesti
function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}