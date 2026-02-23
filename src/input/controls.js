class Controls {
    constructor(canvasElement, player, game) {
        this.canvas = canvasElement;
        this.player = player;
        this.game = game;

        // Track input states
        this.isLeftPressed = false;
        this.isRightPressed = false;
        this.touchActive = false;

        // Set up event listeners
        this.setupEventListeners();
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Touch events
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });

        // Mouse events
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));

        // Keyboard events for desktop testing
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    /**
     * Get touch/mouse position relative to canvas
     */
    getTouchPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        let clientX, clientY;

        if (event.touches) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Scale to canvas coordinates (accounting for CSS scaling)
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;

        return {
            x: x * scaleX,
            y: y * scaleY
        };
    }

    /**
     * Handle touch start
     */
    onTouchStart(event) {
        event.preventDefault();
        this.touchActive = true;
        const pos = this.getTouchPosition(event);
        this.updatePlayerPosition(pos.x, pos.y);
    }

    /**
     * Handle touch move
     */
    onTouchMove(event) {
        event.preventDefault();
        if (this.touchActive) {
            const pos = this.getTouchPosition(event);
            this.updatePlayerPosition(pos.x, pos.y);
        }
    }

    /**
     * Handle touch end
     */
    onTouchEnd(event) {
        event.preventDefault();
        this.touchActive = false;
        this.player.stopMovement();
    }

    /**
     * Handle mouse move
     */
    onMouseMove(event) {
        // Only track if mouse is down and game is playing
        if (this.game && this.game.gameState === GAME_STATE.PLAYING &&
            (event.buttons === 1 || this.touchActive)) {
            const pos = this.getTouchPosition(event);
            this.updatePlayerPosition(pos.x, pos.y);
        }
    }

    /**
     * Handle mouse down
     */
    onMouseDown(event) {
        if (this.game && this.game.gameState === GAME_STATE.PLAYING) {
            const pos = this.getTouchPosition(event);
            this.updatePlayerPosition(pos.x, pos.y);
        }
    }

    /**
     * Handle mouse up
     */
    onMouseUp(event) {
        if (this.game && this.game.gameState === GAME_STATE.PLAYING) {
            this.player.stopMovement();
        }
    }

    /**
     * Handle mouse leave canvas
     */
    onMouseLeave(event) {
        if (this.game && this.game.gameState === GAME_STATE.PLAYING) {
            this.player.stopMovement();
        }
    }

    /**
     * Handle key down
     */
    onKeyDown(event) {
        if (this.game && this.game.gameState !== GAME_STATE.PLAYING) {
            return;
        }

        if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
            this.isLeftPressed = true;
            this.player.moveLeft();
        } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
            this.isRightPressed = true;
            this.player.moveRight();
        }
    }

    /**
     * Handle key up
     */
    onKeyUp(event) {
        if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
            this.isLeftPressed = false;
        } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
            this.isRightPressed = false;
        }

        // Update movement based on remaining pressed keys
        if (this.isLeftPressed && !this.isRightPressed) {
            this.player.moveLeft();
        } else if (this.isRightPressed && !this.isLeftPressed) {
            this.player.moveRight();
        } else {
            this.player.stopMovement();
        }
    }

    /**
     * Update player position based on input
     */
    updatePlayerPosition(x, y) {
        // Keep player at bottom of screen, only control horizontal movement
        const targetX = Math.max(0, Math.min(x - this.player.width / 2, CANVAS_WIDTH - this.player.width));
        const targetY = this.player.y;

        // Smooth movement toward target
        const moveSpeed = PLAYER_SPEED;
        const deltaX = targetX - this.player.x;

        if (Math.abs(deltaX) > 2) {
            // Direct position (for touch control)
            this.player.x = targetX;
            this.player.velocityX = 0;
        }
    }
}
