// ===================
// CONSTANTES DE AI
// ===================

import { BALLS_NORMAL_SPEED } from "./ConstBall";
import { WALL_NORMAL_DISTANCE } from "./ConstFieldWall";
import { PLAYER_NORMAL_HEIGHT } from "./ConstPlayer";

// Precisión de predicción de la IA (0.0 a 1.0)
export const 
    AI_PREDICTION_ACCURACY = 0.9, // 70% de precisión en predicción
    AI_CONFUSION_FACTOR = 0.1,    // 30% de confusión/error
    
    // Distancias y zonas
    AI_REACTION_DISTANCE = WALL_NORMAL_DISTANCE * 2,   // Distancia máxima para reaccionar
    AI_DEAD_ZONE = PLAYER_NORMAL_HEIGHT / 10,           // Zona muerta donde no se mueve
    //AI_SPEED_CHECK = BALLS_NORMAL_SPEED / 10,           // Zona muerta donde no se mueve
    
    // Configuración de comportamiento
    AI_TRACKING_THRESHOLD = 0.1, // Umbral mínimo de velocidad para trackear
    AI_PREDICTION_TIME_LIMIT = 2.0, // Tiempo máximo de predicción en segundos
    
    // Niveles de dificultad (para futura expansión)
    AI_DIFFICULTY_EASY = 0.4,
    AI_DIFFICULTY_MEDIUM = 0.7,
    AI_DIFFICULTY_HARD = 0.9
    ;