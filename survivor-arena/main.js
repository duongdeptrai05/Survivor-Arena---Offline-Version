import { createGameState } from "./state.js";
import { update, draw, spawnEnemy } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set kích thước canvas
canvas.width = 600;
canvas.height = 900;

// // Test vẽ hình
// ctx.fillStyle = "red";
// ctx.fillRect(100, 100, 50, 50);
const state = createGameState(canvas, ctx);
const keys = {};

// Bắt sự kiện bàn phím
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});
// Bắt sự kiện phím 'R' để restart game
document.addEventListener("keydown", event => {
    if (event.key.toLowerCase() === "r" && state.gameOver) {
        restartGame();
    }
});


// Tạo thêm nhiều enemy sau mỗi 5 giây
setInterval(() => spawnEnemy(state), 5000);
// Hàm khởi tạo game
function initGame() {
    state.player.hp = 100;
    state.player.x = 100;
    state.player.y = 100;
    state.enemies.length = 0;
    spawnEnemy(state);
    state.gameOver = false;
    state.score = 0;
    state.startTime = Date.now();
}
// Hàm restart game
function restartGame() {
    initGame();
}




function gameLoop() {
    update(state, keys);
    draw(state);
    requestAnimationFrame(gameLoop);
}

spawnEnemy(state);
gameLoop();