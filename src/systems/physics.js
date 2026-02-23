class Physics {
    static update(game, deltaTime) {
        // Update all entities
        if (game.player) {
            game.player.update(deltaTime);
        }

        // Update bullets
        for (let bullet of game.bullets) {
            if (bullet.active) {
                bullet.update(deltaTime);
            }
        }

        // Update enemies
        for (let enemy of game.enemies) {
            if (enemy.active) {
                enemy.update(deltaTime);
            }
        }
    }

    static checkBoundaries(game) {
        // Check bullets
        for (let i = game.bullets.length - 1; i >= 0; i--) {
            const bullet = game.bullets[i];
            if (bullet.isOffScreen(game.renderer.height)) {
                bullet.active = false;
            }
        }

        // Check enemies
        for (let i = game.enemies.length - 1; i >= 0; i--) {
            const enemy = game.enemies[i];
            if (enemy.y > game.renderer.height) {
                enemy.active = false;
            }
        }
    }
}
