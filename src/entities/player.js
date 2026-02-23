class Player {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;

        // Dimensions
        this.width = PLAYER_CONFIG.WIDTH;
        this.height = PLAYER_CONFIG.HEIGHT;

        // Movement
        this.velocityX = 0;
        this.targetX = x;

        // Shooting
        this.lastShotTime = 0;
        this.fireRate = BULLET_CONFIG.FIRE_RATE;

        // State
        this.health = PLAYER_CONFIG.MAX_HEALTH;
        this.type = ENTITY_TYPE.PLAYER;
        this.active = true;
    }

    update(deltaTime) {
        // Smooth movement toward target position
        const moveSpeed = PLAYER_CONFIG.SPEED * deltaTime;
        const diff = this.targetX - this.x;

        if (Math.abs(diff) < moveSpeed) {
            this.x = this.targetX;
        } else {
            this.x += Math.sign(diff) * moveSpeed;
        }

        // Boundary checking
        this.x = Math.max(0, Math.min(this.x, this.game.renderer.width - this.width));

        // Auto-shooting
        this.lastShotTime += deltaTime;
        if (this.lastShotTime >= this.fireRate && this.game.gameState === GAME_STATE.PLAYING) {
            this.shoot();
            this.lastShotTime = 0;
        }
    }

    shoot() {
        const bulletX = this.x + this.width / 2 - BULLET_CONFIG.WIDTH / 2;
        const bulletY = this.y - BULLET_CONFIG.HEIGHT;
        const bullet = new Bullet(bulletX, bulletY, this.game);
        this.game.addBullet(bullet);
    }

    moveTo(x) {
        this.targetX = Math.max(0, Math.min(x, this.game.renderer.width - this.width));
    }

    moveLeft() {
        this.targetX = Math.max(0, this.x - PLAYER_CONFIG.SPEED * 0.1);
    }

    moveRight() {
        this.targetX = Math.min(
            this.game.renderer.width - this.width,
            this.x + PLAYER_CONFIG.SPEED * 0.1
        );
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
        this.game.damagePlayer(amount);
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
        ctx.fillStyle = COLORS.PLAYER;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
