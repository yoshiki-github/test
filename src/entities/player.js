class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.health = PLAYER_MAX_HEALTH;
        this.maxHealth = PLAYER_MAX_HEALTH;
        this.velocityX = 0;
        this.speed = PLAYER_SPEED;
    }

    /**
     * Move player left
     */
    moveLeft(amount = 1) {
        this.velocityX = -this.speed * amount;
    }

    /**
     * Move player right
     */
    moveRight(amount = 1) {
        this.velocityX = this.speed * amount;
    }

    /**
     * Stop player movement
     */
    stopMovement() {
        this.velocityX = 0;
    }

    /**
     * Set position directly (for touch tracking)
     */
    setPosition(x, y) {
        this.x = x - this.width / 2; // Center on the touch point
        this.y = y - this.height / 2;
    }

    /**
     * Update player position
     */
    update(deltaTime) {
        this.x += this.velocityX * deltaTime;
    }

    /**
     * Apply boundary check to keep player in screen
     */
    applyBoundaryCheck(minX, minY, maxX, maxY) {
        if (this.x < minX) {
            this.x = minX;
        }
        if (this.x > maxX) {
            this.x = maxX;
        }
        if (this.y < minY) {
            this.y = minY;
        }
        if (this.y > maxY) {
            this.y = maxY;
        }
    }

    /**
     * Take damage
     */
    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
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
     * Check if point is inside player
     */
    contains(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }
}
