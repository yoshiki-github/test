class Renderer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        this.setupCanvas();
        this.lastFpsTime = Date.now();
        this.frameCount = 0;
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        // Calculate canvas size based on viewport
        let width = Math.min(window.innerWidth, CANVAS_CONFIG.MAX_WIDTH);
        let height = window.innerHeight;

        // Maintain aspect ratio
        const targetRatio = CANVAS_CONFIG.BASE_WIDTH / CANVAS_CONFIG.BASE_HEIGHT;
        const currentRatio = width / height;

        if (currentRatio > targetRatio) {
            width = height * targetRatio;
        } else {
            height = width / targetRatio;
        }

        // Set canvas size
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        // Scale context for high DPI
        this.ctx.scale(this.dpr, this.dpr);

        // Store logical dimensions (for collision detection, etc.)
        this.width = width;
        this.height = height;
    }

    clear() {
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    render(game) {
        this.clear();
        this.renderEntities(game);
        this.renderHUD(game);
        this.updateFps();
    }

    renderEntities(game) {
        // Render player
        if (game.player) {
            this.renderEntity(game.player);
        }

        // Render bullets
        for (let bullet of game.bullets) {
            if (bullet.active) {
                this.renderEntity(bullet);
            }
        }

        // Render enemies
        for (let enemy of game.enemies) {
            this.renderEntity(enemy);
        }
    }

    renderEntity(entity) {
        if (entity.type === ENTITY_TYPE.PLAYER) {
            this.drawRect(entity.x, entity.y, entity.width, entity.height, COLORS.PLAYER);
        } else if (entity.type === ENTITY_TYPE.BULLET) {
            this.drawRect(entity.x, entity.y, entity.width, entity.height, COLORS.BULLET);
        } else if (entity.type === ENTITY_TYPE.ENEMY) {
            this.drawRect(entity.x, entity.y, entity.width, entity.height, COLORS.ENEMY);
        }
    }

    renderHUD(game) {
        // Score display
        const scoreText = `スコア: ${game.score}`;
        this.drawText(scoreText, 20, 30, '20px', COLORS.TEXT, 'left', 'top');

        // Health display
        const healthText = `HP: ${game.playerHealth}/${PLAYER_CONFIG.MAX_HEALTH}`;
        this.drawText(healthText, this.width - 20, 30, '20px', COLORS.TEXT, 'right', 'top');
    }

    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawCircle(x, y, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawText(text, x, y, size, color, align = 'left', baseline = 'top') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size} Arial, sans-serif`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        this.ctx.shadowColor = COLORS.TEXT_SHADOW;
        this.ctx.shadowBlur = 5;
        this.ctx.fillText(text, x, y);
        this.ctx.shadowColor = 'transparent';
    }

    updateFps() {
        this.frameCount++;
        const now = Date.now();
        if (now - this.lastFpsTime >= 1000) {
            // Uncomment for FPS debugging
            // console.log(`FPS: ${this.frameCount}`);
            this.frameCount = 0;
            this.lastFpsTime = now;
        }
    }

    getCanvasWidth() {
        return this.width;
    }

    getCanvasHeight() {
        return this.height;
    }
}
