class Renderer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.setupCanvas();
    }

    setupCanvas() {
        // Set display size
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // High DPI scaling
        if (this.devicePixelRatio > 1) {
            this.canvas.width = this.width * this.devicePixelRatio;
            this.canvas.height = this.height * this.devicePixelRatio;
            this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
        }

        // Disable image smoothing for pixelated look
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
    }

    /**
     * Clear the entire canvas
     */
    clear() {
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Draw a rectangle
     */
    drawRect(x, y, width, height, color, fill = true, lineWidth = 1) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;

        if (fill) {
            this.ctx.fillRect(x, y, width, height);
        } else {
            this.ctx.strokeRect(x, y, width, height);
        }
    }

    /**
     * Draw a circle
     */
    drawCircle(x, y, radius, color, fill = true, lineWidth = 1) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (fill) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Draw text
     */
    drawText(text, x, y, fontSize = 16, color = COLORS.UI_TEXT, align = 'left', font = 'Arial') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px ${font}`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(text, x, y);
    }

    /**
     * Draw text with outline (for better visibility)
     */
    drawTextOutline(text, x, y, fontSize = 16, color = COLORS.UI_TEXT, outlineColor = '#000', outlineWidth = 2, align = 'left') {
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'top';

        // Draw outline
        this.ctx.strokeStyle = outlineColor;
        this.ctx.lineWidth = outlineWidth;
        this.ctx.strokeText(text, x, y);

        // Draw text
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    /**
     * Render the entire game scene
     */
    render(game) {
        // Clear canvas
        this.clear();

        // Render player
        if (game.player) {
            this.renderEntity(game.player, COLORS.PLAYER);
        }

        // Render bullets
        if (game.bullets) {
            for (let bullet of game.bullets) {
                if (bullet.active) {
                    this.drawRect(bullet.x, bullet.y, bullet.width, bullet.height, COLORS.BULLET);
                }
            }
        }

        // Render enemies
        if (game.enemies) {
            for (let enemy of game.enemies) {
                if (enemy.active !== false) {
                    this.renderEntity(enemy, COLORS.ENEMY);
                }
            }
        }

        // Render HUD (game will handle through separate HUD system)
    }

    /**
     * Helper to render an entity (player, enemy)
     */
    renderEntity(entity, color) {
        this.drawRect(entity.x, entity.y, entity.width, entity.height, color);

        // Optional: Draw health bar for entities with health > 1
        if (entity.health !== undefined && entity.maxHealth !== undefined && entity.maxHealth > 1) {
            this.drawHealthBar(entity);
        }
    }

    /**
     * Draw a health bar above an entity
     */
    drawHealthBar(entity) {
        const barWidth = entity.width;
        const barHeight = 4;
        const barX = entity.x;
        const barY = entity.y - 8;

        // Background (empty)
        this.drawRect(barX, barY, barWidth, barHeight, '#444', true);

        // Health (filled)
        const healthWidth = (entity.health / entity.maxHealth) * barWidth;
        this.drawRect(barX, barY, healthWidth, barHeight, '#00ff00', true);
    }

    /**
     * Get canvas dimensions
     */
    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    /**
     * Handle canvas resize for responsive design
     */
    handleResize() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();

        const aspectRatio = this.width / this.height;
        let newWidth = rect.width;
        let newHeight = rect.height;

        // Maintain aspect ratio
        if (newWidth / newHeight > aspectRatio) {
            newWidth = newHeight * aspectRatio;
        } else {
            newHeight = newWidth / aspectRatio;
        }

        // Set CSS size
        this.canvas.style.width = newWidth + 'px';
        this.canvas.style.height = newHeight + 'px';
    }
}
