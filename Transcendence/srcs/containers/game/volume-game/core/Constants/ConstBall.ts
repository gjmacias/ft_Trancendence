import { TICKRATE } from '../Constants/Constants.ts';

// Propiedades físicas por defecto
export const 
    BALLS_NORMAL_RADIUS = 20, // Ya existe en Constants.ts como BALLS_NORMAL_RADIUS
    BALL_MIN_RADIUS = 0.1,
    BALL_MAX_RADIUS = 50,

    // Velocidades
    BALLS_NORMAL_SPEED = (300  / TICKRATE), // Ya existe en Constants.ts como BALLS_NATURAL_SPEED
    BALLS_MAX_SPEED = BALLS_NORMAL_SPEED * 10, // Ya existe en Constants.ts como BALLS_MAX_SPEED
    BALL_MIN_SPEED = BALLS_NORMAL_SPEED / 2,
    BALL_SPEED_INCREMENT = 1.05, // Factor de incremento al golpear paddle
    BALL_SPEED_CAP = 20, // Velocidad máxima absoluta

    // Control y física
    BALL_DEFAULT_CONTROL_FACTOR = 1.0,
    BALL_MIN_CONTROL_FACTOR = 0.1,
    BALL_MAX_CONTROL_FACTOR = 3.0,
    
    // Direcciones por defecto
    BALL_DEFAULT_DIRECTION_X = 1,
    BALL_DEFAULT_DIRECTION_Y = 0,
    BALL_DEFAULT_DIRECTION_Z = 0,
    BALL_RANDOM_DIRECTION_RANGE = 0.5, // Rango para dirección Z aleatoria
    
    // Posiciones iniciales
    BALL_SPAWN_X = 0,
    BALL_SPAWN_Y = 0,
    BALL_SPAWN_Z = 0,
    
    // Colores por defecto
    BALL_DEFAULT_COLOR = "#FFFFFF",
    BALL_POWERUP_COLOR_SPEED = "#FF0000", // Rojo
    BALL_POWERUP_COLOR_SIZE = "#0000FF",  // Azul
    BALL_POWERUP_COLOR_MULTI = "#00FF00", // Verde
    BALL_POWERUP_COLOR_GHOST = "#FFFF00", // Amarillo
    
    // Configuración de trail
    BALL_TRAIL_ENABLED = true,
    BALL_TRAIL_LENGTH = 20,
    BALL_TRAIL_FADE_TIME = 1000, // ms
    
    // Power-ups
    BALL_POWERUP_DURATION_DEFAULT = 5, // segundos
    BALL_POWERUP_DURATION_SPEED = 10,
    BALL_POWERUP_DURATION_SIZE = 8,
    BALL_POWERUP_DURATION_GHOST = 6,
    
    // Efectos de power-ups
    BALL_SPEED_BOOST_FACTOR = 1.5,
    BALL_SIZE_BOOST_FACTOR = 1.3,
    BALL_CONTROL_BOOST_FACTOR = 1.2,
    
    // Configuración de multibola
    BALL_MULTIBALL_COUNT = 2,
    BALL_MULTIBALL_SPEED_FACTOR = 0.8,
    BALL_MULTIBALL_DIRECTION_VARIANCE = 0.4,
    
    // Límites de separación para colisiones
    BALL_COLLISION_SEPARATION = 1,
    BALL_PADDLE_SEPARATION = 1,
    
    // Configuración de rebote
    BALL_BOUNCE_RESTITUTION = 0.8,
    BALL_PADDLE_SPEED_INCREASE = 1.05,
    BALL_WALL_FRICTION_DEFAULT = 1.0,
    
    // Configuración de IDs
    BALL_ID_MIN = 0,
    BALL_ID_MAX = Number.MAX_SAFE_INTEGER
    ;