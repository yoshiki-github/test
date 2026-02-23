class Enemy {
    constructor(x, y, speed = ENEMY_SPEED) {
        this.x = x;
        this.y = y;
        this.width = ENEMY_WIDTH;
        this.height = ENEMY_HEIGHT;
        this.velocityY = speed;
        this.speed = speed;
        this.health = ENEMY_MAX_HEALTH;
        this.maxHealth = ENEMY_MAX_HEALTH;
        this.active = true;
    }

    /**
     * Update enemy position
     */
    update(deltaTime) {
        this.y += this.velocityY * deltaTime;
    }

    /**
     * Take damage
     */
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.active = false;
        }
    }

    /**
     * Get collision bounds
     */
    getCollisionBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Check if off-screen
     */
    isOffScreen(canvasHeight) {
        return this.y > canvasHeight;
    }
}
