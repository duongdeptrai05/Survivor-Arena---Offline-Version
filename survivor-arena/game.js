export function spawnEnemy(state) {
    state.enemies.push({
        x: 400,
        y: 300,
        size: 40,
        color: "lime",
        speed: 1.5
    });
}
export function update(state, keys) {

    if (state.gameOver) return;

    const player = state.player;
    const canvas = state.canvas;
    const enemies = state.enemies;

    // Di chuyển
    if (keys["w"]) player.y -= player.speed;
    if (keys["s"]) player.y += player.speed;
    if (keys["a"]) player.x -= player.speed;
    if (keys["d"]) player.x += player.speed;

    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;

    // Giới hạn màn hình
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.size));
    player.y = Math.max(0, Math.min(player.y, canvas.height - player.size));

    // Score
    state.survivalTime =
        Math.floor((Date.now() - state.startTime) / 1000);

    state.score = state.survivalTime;

    // Enemy AI
    enemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            enemy.x += (dx / dist) * enemy.speed;
            enemy.y += (dy / dist) * enemy.speed;
        }
    });

    // Collision
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

    if (player.hp <= 0 && !state.gameOver) {
        state.gameOver = true;
    }
}
export function draw(state) {

    const ctx = state.ctx;
    const canvas = state.canvas;
    const player = state.player;
    const enemies = state.enemies;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // PLAYER
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Thanh nhỏ phía trên player
    ctx.fillStyle = "yellow";
    ctx.fillRect(
        player.x + player.size / 4,
        player.y - 15,
        player.size / 2,
        15
    );

    // ENEMIES
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    });

    // HP BAR
    ctx.fillStyle = "red";
    ctx.fillRect(20, 20, player.hp * 2, 20);

    ctx.strokeStyle = "white";
    ctx.strokeRect(20, 20, 200, 20);

    // GAME OVER SCREEN
    if (state.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(
            "Press R to Restart",
            canvas.width / 2,
            canvas.height / 2 + 40
        );
    }

    // SCORE
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + state.score, 20, 60);
}