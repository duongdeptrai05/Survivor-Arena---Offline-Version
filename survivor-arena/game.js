





export function spawnEnemy(state) {
    state.enemies.push({
        x: 400,
        y: 300,
        size: 40,
        color: "lime",
        speed: 1.5,
        hp: 10
    });
}
// Tải ảnh
const playerImg = new Image();
playerImg.src = "assets/player.png";

const enemyImg = new Image();
enemyImg.src = "assets/enemy.png";

const bgImg = new Image();
bgImg.src = "assets/map1.png";
// vũ khí
const weaponsImg = new Image();
weaponsImg.src = "assets/oooo.png";
// đạn shuriken
const shurikenImg = new Image();
shurikenImg.src = "assets/oooo.png";
// energy icon
const energyIcon = new Image();
energyIcon.src = "assets/energy0.png"
// hp icon
const hpIcon = new Image();
hpIcon.src = "assets/hp0.png"













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

    // Survival time (score will include kills below)
    state.survivalTime = Math.floor((Date.now() - state.startTime) / 1000);

    // Cập nhật vị trí đạn, quay phi tiêu và loại bỏ đạn ra ngoài màn hình
    state.bullets = state.bullets.filter(bullet => {
        bullet.x += bullet.dx * bullet.speed;
        bullet.y += bullet.dy * bullet.speed;
        bullet.angle += 0.3; // quay phi tiêu

        // assume shuriken roughly 32×32
        const half = 16;
        return (
            bullet.x + half > 0 &&
            bullet.x - half < canvas.width &&
            bullet.y + half > 0 &&
            bullet.y - half < canvas.height
        );
    });

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


    // Collision: if an enemy touches the player, remove the enemy and
    // subtract one HP from the player.
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const isColliding =
            player.x < enemy.x + enemy.size &&
            player.x + player.size > enemy.x &&
            player.y < enemy.y + enemy.size &&
            player.y + player.size > enemy.y;

        if (isColliding) {
            // remove the enemy that collided with the player
            enemies.splice(i, 1);

            // subtract one HP (use integer decrement)
            player.hp -= 1;
            player.hp = Math.max(player.hp, 0);

            // if player died, set gameOver
            if (player.hp <= 0 && !state.gameOver) {
                state.gameOver = true;
            }
        }
    }

    if (player.hp <= 0 && !state.gameOver) {
        state.gameOver = true;
    }
    // (moved earlier)    // Xử lý va chạm đạn với enemy
    state.bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
        const isColliding =
            bullet.x < enemy.x + enemy.size &&
            bullet.x + bullet.size > enemy.x &&
            bullet.y < enemy.y + enemy.size &&
            bullet.y + bullet.size > enemy.y;

        if (isColliding) {
            enemy.hp -= 5;
            state.bullets.splice(bulletIndex, 1);
            if (enemy.hp <= 0) {
                state.enemies.splice(enemyIndex, 1);
                // award a kill and update score (points per kill = 10)
                state.kills = (state.kills || 0) + 1;
            }
        }
    });
    });

    // Năng lượng tự hồi
    if (player.energy < player.maxEnergy) {
        // regen slower so the decrement is visible
        player.energy += 0.005; // tốc độ hồi năng lượng
        player.energy = Math.min(player.energy, player.maxEnergy);
    }

    // compute score: survival time + points for kills
    const pointsPerKill = 10;
    state.score = state.survivalTime + (state.kills || 0) * pointsPerKill;
}
export function draw(state) {

    const ctx = state.ctx;
    const canvas = state.canvas;
    const player = state.player;
    const enemies = state.enemies;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ background
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    
    // vẽ PLAYER
    // ctx.fillStyle = "red";
    // ctx.fillRect(player.x, player.y, player.size, player.size);
    //vẽ player bằng ảnh
    ctx.drawImage(
    playerImg,
    player.x,
    player.y,
    player.size,
    player.size
    );


    // Thanh nhỏ phía trên player
    // ctx.fillStyle = "yellow";
    // ctx.fillRect(player.x + player.size / 4, player.y - 15, player.size / 2, 10);

    // vú khí phía trên player  
    ctx.drawImage(
            weaponsImg,
            player.x + player.size / 4,
            player.y - 15,
            player.size / 2,
            15
        );

    // vẽ ENEMIES (quái vật)
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.drawImage(
            enemyImg,
            enemy.x,
            enemy.y,
            enemy.size,
            enemy.size
        );
    });

    // // HP BAR
    // const gradient = ctx.createLinearGradient(20, 20, 220, 20);
    // gradient.addColorStop(0, "red");
    // gradient.addColorStop(1, "lime");                                                                       //cũ
    // ctx.fillStyle = gradient;
    // ctx.fillRect(20, 20, player.hp * 2, 20);
    // ctx.strokeStyle = "white";
    // ctx.strokeRect(20, 20, 200, 20);

// vẽ HP bằng icon
    const hpStartX = 20;
    const hpStartY = 10;
    const hpSpacing = 30; // khoảng cách giữa icon

    for (let i = 0; i < player.maxHp; i++) {
        if (i < player.hp) {
            ctx.globalAlpha = 1; // sáng
        } else {
            ctx.globalAlpha = 0.2; // mờ
        }
        ctx.drawImage(
            hpIcon,
            hpStartX + i * hpSpacing,
            hpStartY,
            32,
            32
        );
    }

// VẼ ENERGY
    const startX = 20;
    const startY = 40;
    const spacing = 30; // khoảng cách giữa icon

    const energyCount = Math.floor(player.energy);
    for (let i = 0; i < player.maxEnergy; i++) {
        if (i < energyCount) {
            ctx.globalAlpha = 1; // sáng
        } else {
            ctx.globalAlpha = 0.2; // mờ
        }

        ctx.drawImage(
            energyIcon,
            startX + i * spacing,
            startY,
            32,
            32
        );
    }
    // restore full opacity for the rest of the rendering
    ctx.globalAlpha = 1;


    // Vẽ đạn
    state.bullets.forEach(bullet => {
    ctx.drawImage(shurikenImg, bullet.x - 16, bullet.y - 16, 32, 32);
    });

    // GAME OVER SCREEN
    if (state.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Score: " + state.score, canvas.width / 2, canvas.height / 2 + 20);
        // Survival Time
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Time: " + state.survivalTime + "s", canvas.width / 2, canvas.height / 2 + 40);

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            "Press R to Restart",
            canvas.width / 2,
            canvas.height / 2 + 80
        );
    }

    
    // SCORE
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Score: " + state.score, canvas.width -30, 40);
    // Survival Time
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Time: " + state.survivalTime + "s", canvas.width - 30, 20);

}
// Hàm bắn đạn
export function shoot(state, mouseX, mouseY) {

    const player = state.player;

    if (player.energy <= 0 || state.gameOver) return;

    // consume energy before attempting to shoot so the count always
    // decreases when the player clicks, even if no bullet is created.
    player.energy--;

    const dx = mouseX - (player.x + player.size / 2);
    const dy = mouseY - (player.y + player.size / 2);
    const dist = Math.hypot(dx, dy);

    // avoid division by zero / invalid bullet when clicking exactly on the player
    if (dist === 0) return;

    state.bullets.push({
        x: player.x + player.size / 2,
        y: player.y + player.size / 2,
        dx: dx / dist,
        dy: dy / dist,
        speed: 6,
        angle: 0,
        size: 32 // used by offscreen filter
    });
}