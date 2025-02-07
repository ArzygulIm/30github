const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = { x: 50, y: 250, width: 20, height: 20, velocity: 0, gravity: 0.5 };
let pipes = [];
let frame = 0;
let gameOver = false;

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver = true;
  }
}

function updatePipes() {
  if (frame % 90 === 0) {
    let gap = 100;
    let top = Math.random() * (canvas.height / 2);
    pipes.push({ x: canvas.width, width: 40, top: top, bottom: top + gap });
  }
  pipes.forEach((pipe) => (pipe.x -= 2));
  pipes = pipes.filter((pipe) => pipe.x + pipe.width > 0);
}

function checkCollision() {
  pipes.forEach((pipe) => {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver = true;
    }
  });
}

function gameLoop() {
  if (gameOver) {
    alert("Game Over!");
    document.location.reload();
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  updateBird();
  updatePipes();
  checkCollision();
  frame++;
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", () => {
  bird.velocity = -8;
});
gameLoop();
