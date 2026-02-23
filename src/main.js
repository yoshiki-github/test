// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);

    // Menu button
    document.getElementById('startButton').addEventListener('click', function() {
        game.hideMenu();
        game.start();
        game.startGameLoop();
    });

    // Restart button
    document.getElementById('restartButton').addEventListener('click', function() {
        game.hideGameOver();
        game.hideMenu();
        game.reset();
    });

    // Prevent default touch behaviors
    document.addEventListener('touchmove', function(e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, { passive: false });
});
