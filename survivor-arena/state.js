export function createGameState(canvas, ctx) {
    return {
        canvas,
        ctx,
        player: {
            x: 100,
            y: 100,
            size: 50,
            speed: 6,
            hp: 5,
            maxHp: 5,
            energy: 5,
            maxEnergy : 5
        },
        bullets: [],
        enemies: [],
        score: 0,
        survivalTime: 0,
        kills: 0,
        startTime: Date.now(),
        gameOver: false
    };
}