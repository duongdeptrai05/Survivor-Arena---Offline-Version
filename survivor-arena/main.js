const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set kích thước canvas
canvas.width = 800;
canvas.height =800;

// // Test vẽ hình
// ctx.fillStyle = "red";
// ctx.fillRect(100, 100, 50, 50);


// Player object
const player = {
    x: 100,
    y: 100,
    size: 50,
    speed: 6,
    hp : 100
};
let enemies = [];
let gameOver = false;
let score = 0;
let startTime = Date.now();
let survivalTime = 0;
const keys = {};

// Bắt sự kiện bàn phím
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});
// Cập nhật vị trí player dựa trên phím được nhấn
function update() {
    // Nếu game đã kết thúc, không cập nhật nữa
    if (gameOver) return;
    
    // Di chuyển player
    if (keys["w"]) player.y -= player.speed;
    if (keys["s"]) player.y += player.speed;
    if (keys["a"]) player.x -= player.speed;
    if (keys["d"]) player.x += player.speed;
    // Hỗ trợ thêm phím mũi tên để di chuyển
    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    // Phím R để restart game khi game over
    document.addEventListener("keydown", function(event) {
        if (event.key === "r" && gameOver) {
            restartGame();
            
        }
    });
    // Giới hạn trong màn hình
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    // Giới hạn bên phải và dưới của canvas
    if (player.x + player.size > canvas.width) {
        player.x = canvas.width - player.size;
    }
    if (player.y + player.size > canvas.height) {
        player.y = canvas.height - player.size;
    }
    // Tính điểm dựa trên thời gian sống sót
    survivalTime = Math.floor((Date.now() - startTime) / 1000);
    score = survivalTime ;
    // Cập nhật vị trí enemies để di chuyển về phía player
    enemies.forEach(enemy => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        enemy.x += (dx / distance) * enemy.speed;
        enemy.y += (dy / distance) * enemy.speed;
    }
    });
    // Kiểm tra va chạm giữa player và enemies để giảm HP
    enemies.forEach(enemy => {

    const isColliding =
        player.x < enemy.x + enemy.size &&
        player.x + player.size > enemy.x &&
        player.y < enemy.y + enemy.size &&
        player.y + player.size > enemy.y;

    if (isColliding) {
        player.hp -= 0.5;
        player.hp = Math.max(player.hp, 0);
    }
    });
    // game over nếu HP <= 0

    // if (player.hp <= 0) {       || 
    // alert("Game Over!");        || // code cũ
    // window.location.reload();   || // lỗi reload lâu tạo cảm giác khó chịu, nên chuyển sang cách khác để thông báo game over mà không cần reload trang
    // }                           ||
    if (player.hp <= 0 && !gameOver) {
    gameOver = true;
}
}
function spawnEnemy() {
    const enemy = {
        x: 400,
        y: 300,
        size: 40,
        color: "lime",
        speed: 5
    };

    enemies.push(enemy);
}
// Tạo thêm nhiều enemy sau mỗi 5 giây
setInterval(spawnEnemy, 5000);
// Hàm khởi tạo game
function initGame() {
    player.hp = 100;
    player.x = 100;
    player.y = 100;
    enemies.length = 0;
    spawnEnemy();
    gameOver = false;
    score = 0;
    startTime = Date.now();
}
// Hàm restart game
function restartGame() {
    initGame();
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ player ở giữa canvas
    
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.fillStyle = "yellow";
    ctx.fillRect(
        player.x + player.size / 4,
        player.y - 15,
        player.size / 2,
        15
    );
    // Vẽ enemies
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    });
    // Vẽ HP của player
    // ctx.fillStyle = "white";
    // ctx.font = "20px Arial";
    // ctx.fillText("HP: " + Math.floor(player.hp), 20, 30);

    ctx.fillStyle = "red";
    ctx.fillRect(20, 20, player.hp * 2, 20);

    ctx.strokeStyle = "white";
    ctx.strokeRect(20, 20, 200, 20);
    // Nếu game over, hiển thị thông báo game over
    if (gameOver==true) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Hiển thị thông báo game over

    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    // Hiển thị hướng dẫn restart
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 40);
    }
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Score: " + score, 20, 60);
    //ctx.fillText("Time: " + survivalTime + "s", 20, 85);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

spawnEnemy();
gameLoop();