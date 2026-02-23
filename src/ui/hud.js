class HUD {
    static render(game, renderer) {
        // Score display
        const scoreText = `スコア: ${game.score}`;
        renderer.drawText(scoreText, 20, 30, '20px', COLORS.TEXT, 'left', 'top');

        // Health display
        const healthText = `HP: ${game.playerHealth}/${PLAYER_CONFIG.MAX_HEALTH}`;
        renderer.drawText(healthText, renderer.width - 20, 30, '20px', COLORS.TEXT, 'right', 'top');

        // Difficulty indicator (optional)
        if (game.currentSpawnRate > ENEMY_CONFIG.SPAWN_RATE) {
            const diffText = `Difficulty: ${(game.currentSpawnRate / ENEMY_CONFIG.SPAWN_RATE).toFixed(1)}x`;
            renderer.drawText(diffText, renderer.width / 2, 30, '16px', '#ff8', 'center', 'top');
        }
    }

    static updateScore(score) {
        document.getElementById('score').textContent = `スコア: ${score}`;
    }

    static updateHealth(health) {
        document.getElementById('healthValue').textContent = health;
    }
}
