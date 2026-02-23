// Canvas Configuration
const CANVAS_CONFIG = {
    BASE_WIDTH: 400,
    BASE_HEIGHT: 600,
    MAX_WIDTH: 800,
    BACKGROUND_COLOR: '#1a1a1a'
};

// Game States
const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// Player Configuration
const PLAYER_CONFIG = {
    WIDTH: 40,
    HEIGHT: 50,
    SPEED: 400,  // pixels per second
    MAX_HEALTH: 3,
    COLOR: '#4af'
};

// Bullet Configuration
const BULLET_CONFIG = {
    WIDTH: 5,
    HEIGHT: 15,
    SPEED: 600,  // pixels per second
    MAX_BULLETS: 100,
    COLOR: '#ff4',
    FIRE_RATE: 0.15  // seconds between shots
};

// Enemy Configuration
const ENEMY_CONFIG = {
    WIDTH: 40,
    HEIGHT: 40,
    SPEED: 150,  // pixels per second
    MAX_HEALTH: 1,
    COLOR: '#f44',
    SPAWN_RATE: 0.67,  // enemies per second (1 per 1.5 seconds)
    MAX_ENEMIES: 50
};

// Scoring
const SCORING = {
    POINTS_PER_ENEMY: 10,
    ENEMY_COLLISION_DAMAGE: 1
};

// Difficulty Progression
const DIFFICULTY = {
    SPAWN_RATE_INCREASE: 0.1,  // per 10 seconds
    SCORE_SPAWN_INCREASE: 0.05,  // per 50 points
    DIFFICULTY_INCREASE_INTERVAL: 10000,  // 10 seconds in ms
    MAX_SPAWN_RATE: 2.0  // enemies per second (1 per 0.5 seconds)
};

// Colors
const COLORS = {
    BACKGROUND: '#1a1a1a',
    PLAYER: '#4af',
    BULLET: '#ff4',
    ENEMY: '#f44',
    PLAYER_HIT: '#ff8844',
    ENEMY_HIT: '#ffff44',
    TEXT: '#fff',
    TEXT_SHADOW: 'rgba(0, 0, 0, 0.8)'
};

// Entity Type Constants
const ENTITY_TYPE = {
    PLAYER: 'player',
    ENEMY: 'enemy',
    BULLET: 'bullet'
};
