class PhysicsSystem {
    /**
     * Update all entity positions
     */
    static update(game, deltaTime) {
        if (!game) {
            return;
        }

        // Update player
        if (game.player) {
            game.player.update(deltaTime);

            // Apply gravity if needed
            if (GRAVITY > 0) {
                game.player.velocityX *= FRICTION;
            }

            // Boundary check
            game.player.applyBoundaryCheck(
                0,
                0,
                game.renderer.width - PLAYER_WIDTH,
                game.renderer.height
            );
        }

        // Update bullets
        if (game.bullets) {
            for (let bullet of game.bullets) {
                if (bullet.active) {
                    bullet.update(deltaTime);

                    // Remove off-screen bullets
                    if (bullet.isOffScreen(game.renderer.height)) {
                        bullet.deactivate();
                    }
                }
            }
        }

        // Update enemies
        if (game.enemies) {
            for (let i = game.enemies.length - 1; i >= 0; i--) {
                let enemy = game.enemies[i];
                if (enemy.active !== false) {
                    enemy.update(deltaTime);

                    // Remove off-screen enemies
                    if (enemy.isOffScreen(game.renderer.height)) {
                        game.enemies.splice(i, 1);
                    }
                }
            }
        }
    }

    /**
     * Apply velocity to an entity
     */
    static applyVelocity(entity, deltaTime) {
        if (entity.velocityX !== undefined && entity.x !== undefined) {
            entity.x += entity.velocityX * deltaTime;
        }
        if (entity.velocityY !== undefined && entity.y !== undefined) {
            entity.y += entity.velocityY * deltaTime;
        }
    }

    /**
     * Apply friction to an entity
     */
    static applyFriction(entity, friction = FRICTION) {
        if (entity.velocityX !== undefined) {
            entity.velocityX *= friction;
        }
        if (entity.velocityY !== undefined && GRAVITY === 0) {
            entity.velocityY *= friction;
        }
    }

    /**
     * Apply gravity to an entity
     */
    static applyGravity(entity, gravity = GRAVITY) {
        if (entity.velocityY !== undefined && gravity > 0) {
            entity.velocityY += gravity;
        }
    }

    /**
     * Clamp position within bounds
     */
    static clampPosition(entity, minX, minY, maxX, maxY) {
        if (entity.x < minX) {
            entity.x = minX;
            if (entity.velocityX < 0) {
                entity.velocityX = 0;
            }
        }
        if (entity.x + entity.width > maxX) {
            entity.x = maxX - entity.width;
            if (entity.velocityX > 0) {
                entity.velocityX = 0;
            }
        }
        if (entity.y < minY) {
            entity.y = minY;
            if (entity.velocityY < 0) {
                entity.velocityY = 0;
            }
        }
        if (entity.y + entity.height > maxY) {
            entity.y = maxY - entity.height;
            if (entity.velocityY > 0) {
                entity.velocityY = 0;
            }
        }
    }
}
