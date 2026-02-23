class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = BULLET_WIDTH;
        this.height = BULLET_HEIGHT;
        this.velocityY = -BULLET_SPEED; // Upward
        this.speed = BULLET_SPEED;
        this.active = false;
    }

    /**
     * Fire a bullet from position
     */
    fire(x, y) {
        this.x = x;
        this.y = y;
        this.velocityY = -this.speed;
        this.active = true;
    }

    /**
     * Update bullet position
     */
    update(deltaTime) {
        if (!this.active) {
            return;
        }

        this.y += this.velocityY * deltaTime;
    }

    /**
     * Check if bullet is off-screen
     */
    isOffScreen(canvasHeight) {
        return this.y + this.height < 0 || this.y > canvasHeight;
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
     * Deactivate bullet
     */
    deactivate() {
        this.active = false;
    }
}
