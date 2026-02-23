// Game Constants Configuration

// Canvas
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const MAX_CANVAS_WIDTH = 800;
const MAX_CANVAS_HEIGHT = 1200;

// Player
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 50;
const PLAYER_SPEED = 400; // pixels per second
const PLAYER_START_X = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
const PLAYER_START_Y = CANVAS_HEIGHT - PLAYER_HEIGHT - 10;
const PLAYER_MAX_HEALTH = 3;

// Bullet
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const BULLET_SPEED = 600; // pixels per second (upward)
const MAX_BULLETS = 100;
const BULLET_FIRE_RATE = 0.1; // seconds between bullets

// Enemy
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;
const ENEMY_SPEED = 150; // pixels per second (downward)
const ENEMY_MAX_HEALTH = 1;
const INITIAL_SPAWN_RATE = 0.67; // enemies per second
const MAX_ENEMIES = 50;
const SPAWN_RATE_INCREASE = 0.1; // enemies/second per 10 seconds

// Scoring
const POINTS_PER_ENEMY = 10;
const ENEMY_COLLISION_DAMAGE = 1;

// Game States
const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// Colors
const COLORS = {
    PLAYER: '#00ff00',
    ENEMY: '#ff0000',
    BULLET: '#ffff00',
    BACKGROUND: '#0a0e27',
    UI_TEXT: '#ffffff',
    UI_HEALTH: '#ff6600'
};

// Physics
const GRAVITY = 0; // No gravity for arcade feel
const FRICTION = 1; // No friction for arcade feel
