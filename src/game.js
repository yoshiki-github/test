class Game {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.renderer = new Renderer(canvasElement);

        // Game state
        this.gameState = GAME_STATE.MENU;
        this.score = 0;
        this.playerHealth = PLAYER_CONFIG.MAX_HEALTH;
        this.time = 0;
        this.deltaTime = 0;
        this.lastFrameTime = Date.now();

        // Entities
        this.player = null;
        this.enemies = [];
        this.bullets = [];

        // Timing
        this.spawnTimer = 0;
        this.currentSpawnRate = ENEMY_CONFIG.SPAWN_RATE;
        this.difficultyTimer = 0;

        // Initialize game
        this.init();

        // Setup input controls
        this.controls = new Controls(canvasElement, this);
    }

    init() {
        // Create player
        const playerX = (this.renderer.width - PLAYER_CONFIG.WIDTH) / 2;
        const playerY = this.renderer.height - PLAYER_CONFIG.HEIGHT - 10;
        this.player = new Player(playerX, playerY, this);

        // Initialize arrays
        this.enemies = [];
        this.bullets = [];

        // Reset timers
        this.spawnTimer = 0;
        this.difficultyTimer = 0;
        this.time = 0;
    }

    start() {
        this.gameState = GAME_STATE.PLAYING;
        this.score = 0;
        this.playerHealth = PLAYER_CONFIG.MAX_HEALTH;
        this.init();
        this.updateHUD();
    }

    update(deltaTime) {
        if (this.gameState !== GAME_STATE.PLAYING) {
            return;
        }

        this.deltaTime = Math.min(deltaTime, 0.016); // Cap at 60 FPS equivalent
        this.time += this.deltaTime;

        // Update player
        if (this.player) {
            this.player.update(this.deltaTime);
        }

        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update(this.deltaTime);

            // Remove off-screen bullets
            if (this.bullets[i].y < -BULLET_CONFIG.HEIGHT) {
                this.bullets.splice(i, 1);
            }
        }

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(this.deltaTime);

            // Remove off-screen enemies
            if (this.enemies[i].y > this.renderer.height + ENEMY_CONFIG.HEIGHT) {
                // Enemy escaped, deal damage
                this.damagePlayer(SCORING.ENEMY_COLLISION_DAMAGE);
                this.enemies.splice(i, 1);
            }
        }

        // Spawn enemies
        this.spawnTimer += this.deltaTime;
        const spawnInterval = 1 / this.currentSpawnRate;
        if (this.spawnTimer >= spawnInterval) {
            this.spawnEnemy();
            this.spawnTimer -= spawnInterval;
        }

        // Check collisions
        this.checkCollisions();

        // Difficulty progression
        this.difficultyTimer += this.deltaTime;
        if (this.difficultyTimer >= DIFFICULTY.DIFFICULTY_INCREASE_INTERVAL / 1000) {
            this.increaseDifficulty();
            this.difficultyTimer = 0;
        }

        // Check game over
        if (this.playerHealth <= 0) {
            this.gameOver();
        }
    }

    render() {
        this.renderer.render(this);
    }

    gameLoop = () => {
        const now = Date.now();
        const deltaTime = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop);
    };

    startGameLoop() {
        this.lastFrameTime = Date.now();
        requestAnimationFrame(this.gameLoop);
    }

    spawnEnemy() {
        const randomX = Math.random() * (this.renderer.width - ENEMY_CONFIG.WIDTH);
        const enemy = new Enemy(randomX, -ENEMY_CONFIG.HEIGHT, this);
        this.enemies.push(enemy);
    }

    checkCollisions() {
        const collisionSystem = new CollisionSystem();
        collisionSystem.checkCollisions(this);
    }

    addBullet(bullet) {
        if (this.bullets.length < BULLET_CONFIG.MAX_BULLETS) {
            this.bullets.push(bullet);
        }
    }

    addScore(points) {
        this.score += points;
        this.updateHUD();
        this.checkDifficultyByScore();
    }

    damagePlayer(amount) {
        this.playerHealth -= amount;
        this.updateHUD();

        if (this.playerHealth <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        if (this.gameState === GAME_STATE.GAME_OVER) {
            return;
        }

        this.gameState = GAME_STATE.GAME_OVER;
        this.showGameOver();
    }

    reset() {
        this.start();
        this.updateHUD();
    }

    increaseDifficulty() {
        const increase = DIFFICULTY.SPAWN_RATE_INCREASE / 1000;
        this.currentSpawnRate = Math.min(
            this.currentSpawnRate + increase,
            DIFFICULTY.MAX_SPAWN_RATE
        );
    }

    checkDifficultyByScore() {
        // Increase spawn rate based on score
        const scoreIncrease = Math.floor(this.score / 50) * DIFFICULTY.SCORE_SPAWN_INCREASE / 1000;
        const totalIncrease = scoreIncrease;
        this.currentSpawnRate = Math.min(
            ENEMY_CONFIG.SPAWN_RATE + totalIncrease,
            DIFFICULTY.MAX_SPAWN_RATE
        );
    }

    updateHUD() {
        document.getElementById('score').textContent = `スコア: ${this.score}`;
        document.getElementById('healthValue').textContent = this.playerHealth;
    }

    showGameOver() {
        document.getElementById('finalScore').textContent = `Score: ${this.score}`;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }

    hideGameOver() {
        document.getElementById('gameOverScreen').classList.add('hidden');
    }

    hideMenu() {
        document.getElementById('menuScreen').classList.add('hidden');
    }

    showMenu() {
        document.getElementById('menuScreen').classList.remove('hidden');
    }
}
