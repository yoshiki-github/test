class Game {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.renderer = new Renderer(canvasElement);
        this.hud = new HUD(this);

        // Game state
        this.gameState = GAME_STATE.MENU;
        this.score = 0;
        this.playerHealth = PLAYER_MAX_HEALTH;
        this.time = 0;
        this.deltaTime = 0;
        this.lastFrameTime = 0;

        // Entities
        this.player = null;
        this.bullets = [];
        this.enemies = [];

        // Game mechanics
        this.nextBulletTime = 0;
        this.nextEnemyTime = 0;
        this.spawnRate = INITIAL_SPAWN_RATE;

        // Input
        this.controls = null;

        // Game loop
        this.animationFrameId = null;

        // Initialize
        this.init();
    }

    /**
     * Initialize the game
     */
    init() {
        // Create player
        this.player = new Player(PLAYER_START_X, PLAYER_START_Y);

        // Initialize bullet pool
        this.bullets = [];
        for (let i = 0; i < MAX_BULLETS; i++) {
            this.bullets.push(new Bullet(0, 0));
            this.bullets[i].active = false;
        }

        // Initialize enemies array
        this.enemies = [];

        // Set up controls
        this.controls = new Controls(this.canvas, this.player, this);

        // Reset timing
        this.lastFrameTime = performance.now();
        this.nextBulletTime = 0;
        this.nextEnemyTime = 0;
    }

    /**
     * Start the game
     */
    start() {
        this.gameState = GAME_STATE.PLAYING;
        this.score = 0;
        this.playerHealth = PLAYER_MAX_HEALTH;
        this.time = 0;
        this.enemies = [];
        this.spawnRate = INITIAL_SPAWN_RATE;
        this.nextBulletTime = 0;
        this.nextEnemyTime = 0;

        // Reset player position
        this.player.x = PLAYER_START_X;
        this.player.y = PLAYER_START_Y;
        this.player.velocityX = 0;

        this.update(0);
    }

    /**
     * Update game state
     */
    update(deltaTime) {
        if (this.gameState !== GAME_STATE.PLAYING) {
            return;
        }

        this.deltaTime = deltaTime;
        this.time += deltaTime;

        // Update player
        if (this.player) {
            this.player.update(deltaTime);
            this.player.applyBoundaryCheck(
                0, 0,
                this.renderer.width - PLAYER_WIDTH,
                this.renderer.height
            );
        }

        // Auto shoot
        this.nextBulletTime -= deltaTime;
        if (this.nextBulletTime <= 0) {
            this.playerShoot();
            this.nextBulletTime = BULLET_FIRE_RATE;
        }

        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let bullet = this.bullets[i];
            if (bullet.active) {
                bullet.update(deltaTime);

                // Remove bullets that are off-screen
                if (bullet.y + bullet.height < 0) {
                    bullet.active = false;
                }
            }
        }

        // Spawn enemies
        this.nextEnemyTime -= deltaTime;
        if (this.nextEnemyTime <= 0) {
            this.spawnEnemy();
            this.nextEnemyTime = 1 / this.spawnRate;
        }

        // Update difficulty
        this.updateDifficulty();

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            let enemy = this.enemies[i];
            if (enemy.active !== false) {
                enemy.update(deltaTime);

                // Remove enemies that are off-screen
                if (enemy.y > this.renderer.height) {
                    this.enemies.splice(i, 1);
                }
            }
        }

        // Check collisions
        if (CollisionSystem) {
            CollisionSystem.checkCollisions(this);
        }

        // Check game over condition
        if (this.playerHealth <= 0) {
            this.gameState = GAME_STATE.GAME_OVER;
        }
    }

    /**
     * Render the game
     */
    render() {
        this.renderer.render(this);
        this.hud.render(this.renderer.ctx, this);
    }

    /**
     * Game loop handler
     */
    handleGameLoop = (currentTime) => {
        if (this.lastFrameTime === 0) {
            this.lastFrameTime = currentTime;
        }

        const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = currentTime;

        // Cap delta time to prevent large jumps
        const cappedDeltaTime = Math.min(deltaTime, 1 / 30); // Max 33ms per frame

        this.update(cappedDeltaTime);
        this.render();

        this.animationFrameId = requestAnimationFrame(this.handleGameLoop);
    }

    /**
     * Start the game loop
     */
    startLoop() {
        this.animationFrameId = requestAnimationFrame(this.handleGameLoop);
    }

    /**
     * Stop the game loop
     */
    stopLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Player shoots a bullet
     */
    playerShoot() {
        // Find an inactive bullet from the pool
        for (let bullet of this.bullets) {
            if (!bullet.active) {
                bullet.fire(
                    this.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
                    this.player.y
                );
                break;
            }
        }
    }

    /**
     * Spawn a new enemy
     */
    spawnEnemy() {
        const x = Math.random() * (this.renderer.width - ENEMY_WIDTH);
        const y = -ENEMY_HEIGHT - 10;
        const enemy = new Enemy(x, y, ENEMY_SPEED);
        this.enemies.push(enemy);
    }

    /**
     * Update difficulty based on time and score
     */
    updateDifficulty() {
        // Increase spawn rate every 10 seconds
        const newSpawnRate = INITIAL_SPAWN_RATE + (Math.floor(this.time / 10) * SPAWN_RATE_INCREASE);
        this.spawnRate = Math.min(newSpawnRate, 2); // Cap at 2 enemies per second

        // Could also increase enemy speed here
    }

    /**
     * Add points to score
     */
    addScore(points) {
        this.score += points;
    }

    /**
     * Damage the player
     */
    damagePlayer(amount) {
        this.playerHealth -= amount;
        if (this.playerHealth < 0) {
            this.playerHealth = 0;
        }
    }

    /**
     * Get game over status
     */
    isGameOver() {
        return this.gameState === GAME_STATE.GAME_OVER;
    }

    /**
     * Reset game state for menu
     */
    resetToMenu() {
        this.gameState = GAME_STATE.MENU;
        this.score = 0;
        this.playerHealth = PLAYER_MAX_HEALTH;
        this.time = 0;
        this.enemies = [];
        this.spawnRate = INITIAL_SPAWN_RATE;

        // Clear bullets
        for (let bullet of this.bullets) {
            bullet.active = false;
        }

        // Reset player
        if (this.player) {
            this.player.x = PLAYER_START_X;
            this.player.y = PLAYER_START_Y;
            this.player.velocityX = 0;
        }
    }
}
