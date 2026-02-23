class CollisionSystem {
    checkCollisions(game) {
        // Check bullet-enemy collisions
        this.checkBulletEnemyCollisions(game);

        // Check enemy-player collisions
        this.checkEnemyPlayerCollisions(game);
    }

    checkBulletEnemyCollisions(game) {
        for (let i = game.bullets.length - 1; i >= 0; i--) {
            const bullet = game.bullets[i];

            if (!bullet.active) continue;

            for (let j = game.enemies.length - 1; j >= 0; j--) {
                const enemy = game.enemies[j];

                if (!enemy.active) continue;

                if (this.checkAABBCollision(bullet.getCollisionBounds(), enemy.getCollisionBounds())) {
                    // Handle collision
                    enemy.takeDamage(1);
                    bullet.active = false;
                    break; // One bullet can only hit one enemy per frame
                }
            }
        }
    }

    checkEnemyPlayerCollisions(game) {
        if (!game.player || !game.player.active) return;

        const playerBounds = game.player.getCollisionBounds();

        for (let i = game.enemies.length - 1; i >= 0; i--) {
            const enemy = game.enemies[i];

            if (!enemy.active) continue;

            if (this.checkAABBCollision(playerBounds, enemy.getCollisionBounds())) {
                // Enemy hits player
                game.damagePlayer(SCORING.ENEMY_COLLISION_DAMAGE);
                enemy.active = false;
                game.enemies.splice(i, 1);
            }
        }
    }

    checkAABBCollision(bounds1, bounds2) {
        return (
            bounds1.left < bounds2.right &&
            bounds1.right > bounds2.left &&
            bounds1.top < bounds2.bottom &&
            bounds1.bottom > bounds2.top
        );
    }
}
