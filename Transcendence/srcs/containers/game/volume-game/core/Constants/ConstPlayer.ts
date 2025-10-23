// ===================
// CONSTANTES DE PLAYER
// ===================
import { PHI, TICKRATE } from "./Constants";
import { BALLS_NORMAL_RADIUS, BALLS_NORMAL_SPEED } from "./ConstBall";
// Dimensiones por defecto
export const 
    PLAYER_NORMAL_DEPTH = BALLS_NORMAL_RADIUS * 2,
    PLAYER_NORMAL_WIDTH = BALLS_NORMAL_RADIUS * 2 * PHI,
    PLAYER_NORMAL_HEIGHT = 200,

    // Posición inicial
    PLAYER_SPAWN_X = 0,
    PLAYER_SPAWN_Y = 0,
    PLAYER_SPAWN_Z = 0,
    
    // Rotación inicial
    PLAYER_DEFAULT_ROTATION = 0,
    
    // Configuración inicial
    PLAYER_MAX_SPEED = BALLS_NORMAL_SPEED * 2,
    PLAYER_DEFAULT_SPEED = 0,
    PLAYER_DEFAULT_PERCENTAGE = 0.5,
    
    // Colores por defecto
    PLAYER_DEFAULT_COLOR = "#ffffff",
    PLAYER_HUMAN_COLOR = "#00ff00",
    PLAYER_AI_COLOR = "#ff0000",
    PLAYER_BLOCK_COLOR = "#ffff00"
    ;