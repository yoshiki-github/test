class Bullet {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;

        // Dimensions
        this.width = BULLET_CONFIG.WIDTH;
        this.height = BULLET_CONFIG.HEIGHT;

        // Movement (negative Y = upward)
        this.velocityY = -BULLET_CONFIG.SPEED;

        // State
        this.active = true;
        this.type = ENTITY_TYPE.BULLET;
    }

    update(deltaTime) {
        this.y += this.velocityY * deltaTime;

        // Deactivate if off-screen
        if (this.y < -this.height) {
            this.active = false;
        }
    }

    getCollisionBounds() {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.width,
            bottom: this.y + this.height,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    isOffScreen(canvasHeight) {
        return this.y < -this.height || this.y > canvasHeight;
    }

    render(ctx) {
        ctx.fillStyle = COLORS.BULLET;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
