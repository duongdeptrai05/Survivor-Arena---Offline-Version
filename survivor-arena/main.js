import { createGameState } from "./state.js";
import { update, draw, spawnEnemy,shoot} from "./game.js";


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set kích thước canvas
canvas.width = 600;
canvas.height = 900;
// Tạo state game
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

canvas.addEventListener("click", (event) => {

    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    shoot(state, mouseX, mouseY);
});


// Tạo thêm nhiều enemy sau mỗi 5 giây
setInterval(() => spawnEnemy(state), 5000);
// Hàm khởi tạo game
function initGame() {
    // reset player using values already defined in the state
    state.player.hp = state.player.maxHp;
    state.player.energy = state.player.maxEnergy;
    state.player.x = 100;
    state.player.y = 100;

    state.bullets.length = 0;
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

    // // debug: see whether the loop is executing and catching any errors
    // try {
    //     // console.log('frame');
    //     update(state, keys);
    //     draw(state);
    // } catch (err) {
    //     console.error("gameLoop caught error:", err);
    // }
    requestAnimationFrame(gameLoop);
}

spawnEnemy(state);
gameLoop();