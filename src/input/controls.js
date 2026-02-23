class Controls {
    constructor(canvasElement, game) {
        this.canvas = canvasElement;
        this.game = game;
        this.touchActive = false;

        // Setup event listeners
        this.setupTouchEvents();
        this.setupMouseEvents();
    }

    setupTouchEvents() {
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
        this.canvas.addEventListener('touchcancel', (e) => this.onTouchEnd(e), { passive: false });
    }

    setupMouseEvents() {
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    onTouchStart(e) {
        if (this.game.gameState !== GAME_STATE.PLAYING) {
            return;
        }
        e.preventDefault();
        this.touchActive = true;
        this.handleTouchMove(e);
    }

    onTouchMove(e) {
        if (this.game.gameState !== GAME_STATE.PLAYING || !this.touchActive) {
            return;
        }
        e.preventDefault();
        this.handleTouchMove(e);
    }

    onTouchEnd(e) {
        this.touchActive = false;
    }

    handleTouchMove(e) {
        if (!e.touches || e.touches.length === 0) {
            return;
        }

        const position = this.getTouchPosition(e.touches[0]);
        if (position) {
            this.game.player.moveTo(position.x - this.game.player.width / 2);
        }
    }

    onMouseMove(e) {
        if (this.game.gameState !== GAME_STATE.PLAYING) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;

        if (this.game.player && !this.touchActive) {
            this.game.player.moveTo(x - this.game.player.width / 2);
        }
    }

    onMouseDown(e) {
        // Optional: trigger actions on mouse down if needed
    }

    onMouseUp(e) {
        // Optional: trigger actions on mouse up if needed
    }

    getTouchPosition(touch) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    }
}
