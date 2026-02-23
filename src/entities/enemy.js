class Enemy {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;

        // Dimensions
        this.width = ENEMY_CONFIG.WIDTH;
        this.height = ENEMY_CONFIG.HEIGHT;

        // Movement (positive Y = downward)
        this.velocityY = ENEMY_CONFIG.SPEED;

        // State
        this.health = ENEMY_CONFIG.MAX_HEALTH;
        this.type = ENTITY_TYPE.ENEMY;
        this.active = true;
        this.hitFlash = 0;
    }

    update(deltaTime) {
        this.y += this.velocityY * deltaTime;

        // Update hit flash
        if (this.hitFlash > 0) {
            this.hitFlash -= deltaTime;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        this.hitFlash = 0.1; // Flash for 0.1 seconds

        if (this.health <= 0) {
            this.active = false;
            this.game.addScore(SCORING.POINTS_PER_ENEMY);
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

    render(ctx) {
        // Draw with hit flash effect
        if (this.hitFlash > 0) {
            ctx.fillStyle = COLORS.ENEMY_HIT;
        } else {
            ctx.fillStyle = COLORS.ENEMY;
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
