// ===================
// CONSTANTES DE FIELD
// ===================

import { TICK } from "./Constants.ts";
import { PLAYER_NORMAL_HEIGHT } from "./ConstPlayer.ts";

// Configuración básica adicional
export const 
    FIELD_DEFAULT_ID = 1,
    FIELD_NORMAL_HEIGHT = 4 * PLAYER_NORMAL_HEIGHT,
	FIELD_NORMAL_WIDTH = FIELD_NORMAL_HEIGHT * (16 / 9),
	FIELD_CONSTANT_BOUNCE = 0.75,

    // ===================
    // CONSTANTES DE WALL
    // ===================

    // IDs de las 4 paredes básicas
	WALL_NORMAL_DISTANCE = FIELD_NORMAL_HEIGHT,
    WALL_LEFT_ID = 1,
    WALL_TOP_ID = 2,
    WALL_RIGHT_ID = 3,
    WALL_BOTTOM_ID = 4,
    
    // Propiedades por defecto
    WALL_DEFAULT_FRICTION_PER_SECOND = 0.7,
	WALL_DEFAULT_FRICTION = Math.pow(1 - WALL_DEFAULT_FRICTION_PER_SECOND, TICK / 1000), //Gracias ChatGPT :)

    WALL_DEFAULT_COLOR = "#FFFFFF",
    
    // Colores por rol
    WALL_NORMAL_COLOR = "#FFFFFF",
    WALL_PLAYER_COLOR = "#00FF00", 
    WALL_BOUNCE_COLOR = "#FF0000"
    ;