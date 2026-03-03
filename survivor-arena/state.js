export function createGameState(canvas, ctx) {
    return {
        canvas,
        ctx,
        player: {
            x: 100,
            y: 100,
            size: 50,
            speed: 6,
            hp: 1000
        },
        enemies: [],
        score: 0,
        survivalTime: 0,
        startTime: Date.now(),
        gameOver: false
    };
}