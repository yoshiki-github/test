// Initialize game when DOM is ready
let game = null;

function initializeGame() {
    const canvasElement = document.getElementById('gameCanvas');
    if (!canvasElement) {
        console.error('Canvas element not found');
        return;
    }

    // Create game instance
    game = new Game(canvasElement);

    // Start game from menu
    showMenu();

    // Handle window resize
    window.addEventListener('resize', () => {
        if (game && game.renderer) {
            game.renderer.handleResize();
        }
    });

    // Prevent default touch actions for better gameplay
    canvasElement.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });

    canvasElement.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    canvasElement.addEventListener('touchend', (e) => {
        e.preventDefault();
    }, { passive: false });
}

/**
 * Show menu screen
 */
function showMenu() {
    if (!game) return;

    game.gameState = GAME_STATE.MENU;
    game.score = 0;
    game.playerHealth = PLAYER_MAX_HEALTH;
    game.time = 0;
    game.enemies = [];

    // Clear bullets
    for (let bullet of game.bullets) {
        bullet.active = false;
    }

    // Start rendering menu
    game.lastFrameTime = 0;
    game.animationFrameId = requestAnimationFrame((currentTime) => {
        renderMenu(currentTime);
    });
}

/**
 * Render menu screen with update and render loop
 */
function renderMenu(currentTime) {
    if (game.gameState !== GAME_STATE.MENU) {
        return;
    }

    // Simple menu rendering
    game.renderer.clear();

    // Draw title
    game.renderer.drawTextOutline(
        'MOBILE SHOOTING GAME',
        game.renderer.width / 2,
        game.renderer.height / 3,
        36,
        COLORS.UI_TEXT,
        '#000',
        2,
        'center'
    );

    // Draw instructions
    game.renderer.drawText(
        'Touch or move mouse to control',
        game.renderer.width / 2,
        game.renderer.height / 2 - 40,
        14,
        COLORS.UI_TEXT,
        'center'
    );

    game.renderer.drawText(
        'Destroy all enemies to survive',
        game.renderer.width / 2,
        game.renderer.height / 2,
        14,
        COLORS.UI_TEXT,
        'center'
    );

    // Draw start button
    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonX = game.renderer.width / 2 - buttonWidth / 2;
    const buttonY = game.renderer.height / 2 + 80;

    game.renderer.drawRect(buttonX, buttonY, buttonWidth, buttonHeight, COLORS.UI_TEXT, false, 2);
    game.renderer.drawTextOutline(
        'START',
        game.renderer.width / 2,
        buttonY + buttonHeight / 2 - 8,
        20,
        COLORS.UI_TEXT,
        '#000',
        1,
        'center'
    );

    // Check for click/touch on button
    if (game.menuButtonClicked !== undefined && game.menuButtonClicked) {
        game.menuButtonClicked = false;
        game.start();
        game.startLoop();
        return;
    }

    // Continue menu loop
    game.animationFrameId = requestAnimationFrame(renderMenu);
}

/**
 * Render game over screen
 */
function renderGameOver() {
    if (game.gameState !== GAME_STATE.GAME_OVER) {
        return;
    }

    game.renderer.clear();

    // Draw game over text
    game.renderer.drawTextOutline(
        'GAME OVER',
        game.renderer.width / 2,
        game.renderer.height / 3,
        40,
        '#ff0000',
        '#000',
        2,
        'center'
    );

    // Draw score
    game.renderer.drawText(
        `SCORE: ${game.score}`,
        game.renderer.width / 2,
        game.renderer.height / 2 - 40,
        24,
        COLORS.UI_TEXT,
        'center'
    );

    // Draw restart button
    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonX = game.renderer.width / 2 - buttonWidth / 2;
    const buttonY = game.renderer.height / 2 + 80;

    game.renderer.drawRect(buttonX, buttonY, buttonWidth, buttonHeight, COLORS.UI_TEXT, false, 2);
    game.renderer.drawTextOutline(
        'RESTART',
        game.renderer.width / 2,
        buttonY + buttonHeight / 2 - 8,
        20,
        COLORS.UI_TEXT,
        '#000',
        1,
        'center'
    );

    // Check for click/touch on button
    if (game.gameOverButtonClicked !== undefined && game.gameOverButtonClicked) {
        game.gameOverButtonClicked = false;
        game.stopLoop();
        showMenu();
        return;
    }

    // Continue game over loop
    game.animationFrameId = requestAnimationFrame(renderGameOver);
}

/**
 * Handle canvas click/touch for menu and game over buttons
 */
function setupMenuClickHandlers() {
    const canvasElement = document.getElementById('gameCanvas');

    // Handle click
    canvasElement.addEventListener('click', (event) => {
        handleCanvasClick(event);
    });

    // Handle touch
    canvasElement.addEventListener('touchend', (event) => {
        handleCanvasTouchEnd(event);
    });
}

function handleCanvasClick(event) {
    if (!game) return;

    const rect = game.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (game.gameState === GAME_STATE.MENU) {
        // Check if click is on start button
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonX = game.renderer.width / 2 - buttonWidth / 2;
        const buttonY = game.renderer.height / 2 + 80;

        if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
            game.menuButtonClicked = true;
        }
    } else if (game.gameState === GAME_STATE.GAME_OVER) {
        // Check if click is on restart button
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonX = game.renderer.width / 2 - buttonWidth / 2;
        const buttonY = game.renderer.height / 2 + 80;

        if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
            game.gameOverButtonClicked = true;
        }
    }
}

function handleCanvasTouchEnd(event) {
    if (!game) return;

    const rect = game.canvas.getBoundingClientRect();
    const touch = event.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (game.gameState === GAME_STATE.MENU) {
        // Check if touch is on start button
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonX = game.renderer.width / 2 - buttonWidth / 2;
        const buttonY = game.renderer.height / 2 + 80;

        if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
            game.menuButtonClicked = true;
        }
    } else if (game.gameState === GAME_STATE.GAME_OVER) {
        // Check if touch is on restart button
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonX = game.renderer.width / 2 - buttonWidth / 2;
        const buttonY = game.renderer.height / 2 + 80;

        if (x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight) {
            game.gameOverButtonClicked = true;
        }
    }
}

// Set up menu loop override when game over
function setupGameOverLoop() {
    // Override the game loop to check for game over
    const originalStartLoop = Game.prototype.startLoop;
    Game.prototype.startLoop = function() {
        const loop = (currentTime) => {
            if (this.lastFrameTime === 0) {
                this.lastFrameTime = currentTime;
            }

            const deltaTime = (currentTime - this.lastFrameTime) / 1000;
            this.lastFrameTime = currentTime;
            const cappedDeltaTime = Math.min(deltaTime, 1 / 30);

            this.update(cappedDeltaTime);
            this.render();

            if (this.gameState === GAME_STATE.GAME_OVER) {
                this.stopLoop();
                this.lastFrameTime = 0;
                renderGameOver();
            } else {
                this.animationFrameId = requestAnimationFrame(loop);
            }
        };

        this.animationFrameId = requestAnimationFrame(loop);
    };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeGame();
        setupMenuClickHandlers();
        setupGameOverLoop();
    });
} else {
    initializeGame();
    setupMenuClickHandlers();
    setupGameOverLoop();
}
