class HUD {
    constructor(game) {
        this.game = game;
        this.padding = 10;
        this.healthBarWidth = 100;
        this.healthBarHeight = 20;
    }

    /**
     * Render the HUD
     */
    render(ctx, game) {
        this.renderScore(ctx, game);
        this.renderHealth(ctx, game);
    }

    /**
     * Render score display
     */
    renderScore(ctx, game) {
        const scoreText = `SCORE: ${game.score}`;

        // Draw at top-right corner
        const x = game.renderer.width - this.padding;
        const y = this.padding;

        ctx.fillStyle = COLORS.UI_TEXT;
        ctx.font = '18px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(scoreText, x, y);
    }

    /**
     * Render health display
     */
    renderHealth(ctx, game) {
        const x = this.padding;
        const y = this.padding;

        // Draw health label
        ctx.fillStyle = COLORS.UI_TEXT;
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('HEALTH:', x, y);

        // Draw health bar
        const barX = x + 80;
        const barY = y + 2;
        const barWidth = 120;
        const barHeight = 16;

        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health fill
        const healthPercent = Math.max(0, game.playerHealth / game.playerHealth > 1 ? 1 : game.playerHealth / PLAYER_MAX_HEALTH);
        const fillWidth = barWidth * healthPercent;

        // Color based on health
        if (healthPercent > 0.5) {
            ctx.fillStyle = '#00ff00';
        } else if (healthPercent > 0.25) {
            ctx.fillStyle = '#ffff00';
        } else {
            ctx.fillStyle = '#ff0000';
        }

        ctx.fillRect(barX, barY, fillWidth, barHeight);

        // Border
        ctx.strokeStyle = COLORS.UI_TEXT;
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Health value
        ctx.fillStyle = COLORS.UI_TEXT;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${game.playerHealth}/${PLAYER_MAX_HEALTH}`, barX + barWidth / 2, barY + barHeight / 2);
    }

    /**
     * Render floating score text (for enemies destroyed)
     */
    renderFloatingText(ctx, x, y, text, color = COLORS.UI_TEXT) {
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
    }

    /**
     * Render game state message
     */
    renderStateMessage(ctx, game, message) {
        const x = game.renderer.width / 2;
        const y = game.renderer.height / 2;

        // Draw semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, game.renderer.width, game.renderer.height);

        // Draw message
        ctx.fillStyle = COLORS.UI_TEXT;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, x, y);
    }

    /**
     * Render level/wave info
     */
    renderWaveInfo(ctx, game, waveNumber) {
        const text = `WAVE ${waveNumber}`;
        const x = game.renderer.width / 2;
        const y = game.renderer.height / 4;

        ctx.fillStyle = COLORS.UI_TEXT;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
    }

    /**
     * Render countdown timer
     */
    renderTimer(ctx, seconds) {
        const text = `${Math.ceil(seconds)}s`;

        ctx.fillStyle = COLORS.UI_TEXT;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(text, ctx.canvas.width - 10, 10);
    }

    /**
     * Render FPS counter (for debugging)
     */
    renderFPS(ctx, fps) {
        const text = `FPS: ${Math.round(fps)}`;

        ctx.fillStyle = fps > 55 ? '#00ff00' : fps > 30 ? '#ffff00' : '#ff0000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(text, 10, 10);
    }

    /**
     * Render combo multiplier
     */
    renderCombo(ctx, game, combo) {
        if (combo > 1) {
            const text = `COMBO x${combo}`;
            const x = game.renderer.width / 2;
            const y = game.renderer.height / 3;

            ctx.fillStyle = combo > 10 ? '#ff00ff' : '#ffff00';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x, y);
        }
    }
}
