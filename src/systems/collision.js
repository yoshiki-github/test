class CollisionSystem {
    /**
     * Check all collisions in the game
     */
    static checkCollisions(game) {
        if (!game) {
            return;
        }

        // Check bullet-enemy collisions
        this.checkBulletEnemyCollisions(game);

        // Check enemy-player collisions
        this.checkEnemyPlayerCollisions(game);
    }

    /**
     * Check collisions between bullets and enemies
     */
    static checkBulletEnemyCollisions(game) {
        if (!game.bullets || !game.enemies) {
            return;
        }

        for (let i = game.bullets.length - 1; i >= 0; i--) {
            let bullet = game.bullets[i];

            if (!bullet.active) {
                continue;
            }

            const bulletBounds = bullet.getCollisionBounds();

            for (let j = game.enemies.length - 1; j >= 0; j--) {
                let enemy = game.enemies[j];

                if (enemy.active === false) {
                    continue;
                }

                const enemyBounds = enemy.getCollisionBounds();

                if (this.checkAABBCollision(bulletBounds, enemyBounds)) {
                    // Collision detected!
                    bullet.deactivate();
                    enemy.takeDamage(1);

                    if (enemy.active === false) {
                        // Enemy destroyed
                        game.addScore(POINTS_PER_ENEMY);
                        game.enemies.splice(j, 1);
                    }

                    // Break to avoid checking this bullet against more enemies
                    break;
                }
            }
        }
    }

    /**
     * Check collisions between enemies and player
     */
    static checkEnemyPlayerCollisions(game) {
        if (!game.player || !game.enemies) {
            return;
        }

        const playerBounds = game.player.getCollisionBounds();

        for (let i = game.enemies.length - 1; i >= 0; i--) {
            let enemy = game.enemies[i];

            if (enemy.active === false) {
                continue;
            }

            const enemyBounds = enemy.getCollisionBounds();

            if (this.checkAABBCollision(playerBounds, enemyBounds)) {
                // Collision detected!
                game.damagePlayer(ENEMY_COLLISION_DAMAGE);
                enemy.takeDamage(1);

                if (enemy.active === false) {
                    game.enemies.splice(i, 1);
                }
            }
        }
    }

    /**
     * AABB (Axis-Aligned Bounding Box) collision detection
     */
    static checkAABBCollision(bounds1, bounds2) {
        return bounds1.x < bounds2.x + bounds2.width &&
               bounds1.x + bounds1.width > bounds2.x &&
               bounds1.y < bounds2.y + bounds2.height &&
               bounds1.y + bounds1.height > bounds2.y;
    }

    /**
     * Circle collision detection (distance-based)
     */
    static checkCircleCollision(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    }

    /**
     * Point in rectangle check
     */
    static pointInRect(x, y, rect) {
        return x >= rect.x &&
               x <= rect.x + rect.width &&
               y >= rect.y &&
               y <= rect.y + rect.height;
    }

    /**
     * Get collision normal (direction from one object to another)
     */
    static getCollisionNormal(bounds1, bounds2) {
        const centerX1 = bounds1.x + bounds1.width / 2;
        const centerY1 = bounds1.y + bounds1.height / 2;
        const centerX2 = bounds2.x + bounds2.width / 2;
        const centerY2 = bounds2.y + bounds2.height / 2;

        let dx = centerX2 - centerX1;
        let dy = centerY2 - centerY1;

        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) {
            return { x: 0, y: 0 };
        }

        return {
            x: dx / length,
            y: dy / length
        };
    }

    /**
     * Get collision depth (how much objects overlap)
     */
    static getCollisionDepth(bounds1, bounds2) {
        const overlapLeft = (bounds1.x + bounds1.width) - bounds2.x;
        const overlapRight = (bounds2.x + bounds2.width) - bounds1.x;
        const overlapTop = (bounds1.y + bounds1.height) - bounds2.y;
        const overlapBottom = (bounds2.y + bounds2.height) - bounds1.y;

        let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        return Math.abs(minOverlap);
    }
}
