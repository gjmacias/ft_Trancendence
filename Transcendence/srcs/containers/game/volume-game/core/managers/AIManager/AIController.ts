import { Player } from "../../entities/Player";
import { Ball } from "../../entities/Ball";
import {
    AI_PREDICTION_ACCURACY, AI_CONFUSION_FACTOR, AI_REACTION_DISTANCE,
    AI_DEAD_ZONE, AI_TRACKING_THRESHOLD, AI_PREDICTION_TIME_LIMIT
} from '../../Constants/ConstAI';

/**
 * Actualiza el movimiento del jugador IA usando solo player.moving
 * @param player Player IA que se va a mover
 * @param ball Bola principal que debe seguir la IA
 * @param field Campo del juego (no usado por ahora)
 * @param dt Delta time (no usado, movement manager se encarga)
 */
export function updatePlayerAI(
    player: Player,
    ball: Ball,
): void {
    // Verificar condiciones básicas usando getters
    if (!player.isAI || !player.isActive) {
        return;
    }

    if (!ball.isInPlay || !ball.isMoving) {
        player.moving = 0;
        return;
    }

    // Calcular hacia dónde debe moverse la IA
    const targetDirection = calculateAIDirection(player, ball);
    
    // Aplicar el movimiento (solo -1, 0, 1)
    player.moving = targetDirection;
}

/**
 * Calcula la dirección que debe tomar la IA (-1, 0, 1)
 */
function calculateAIDirection(player: Player, ball: Ball): number {
    // Obtener posiciones usando getters
    const playerY = player.position.y;
    const ballPosition = ball.currentPosition;
    const ballVelocity = ball.velocity;
    
    // Verificar si la bola está lo suficientemente cerca
    const distanceToBall = Math.abs(player.position.x - ballPosition.x);
    if (distanceToBall > AI_REACTION_DISTANCE) {
        return 0; // Muy lejos, no hacer nada
    }
    
    // Verificar si la bola se mueve hacia el jugador
    if (!isBallMovingTowardsPlayer(player, ball)) {
        return 0; // La bola se aleja, no seguir
    }
    
    // Calcular posición objetivo con predicción
    const targetY = calculatePredictedPosition(player, ball);
    
    // Calcular diferencia
    const diffY = targetY - playerY;
    
    // Aplicar zona muerta
    if (Math.abs(diffY) < AI_DEAD_ZONE) {
        return 0;
    }
    
    // Retornar dirección simple
    return diffY > 0 ? -1 : 1;
}

/**
 * Calcula la posición Y predicha donde estará la bola
 */
function calculatePredictedPosition(player: Player, ball: Ball): number {
    const ballPosition = ball.currentPosition;
    const ballVelocity = ball.velocity;
    
    // Si la bola no se mueve horizontalmente, usar posición actual
    if (Math.abs(ballVelocity.x) < AI_TRACKING_THRESHOLD) {
        return ballPosition.y;
    }
    
    // Calcular tiempo estimado hasta que la bola llegue al jugador
    const distanceX = Math.abs(player.position.x - ballPosition.x);
    const timeToReach = distanceX / Math.abs(ballVelocity.x);
    
    // Limitar tiempo de predicción
    const clampedTime = Math.min(timeToReach, AI_PREDICTION_TIME_LIMIT);
    
    // Calcular posición Y predicha
    let predictedY = ballPosition.y + (ballVelocity.y * clampedTime);
    
    // Aplicar precisión de IA (mezcla entre predicción perfecta y posición actual)
    const perfectPrediction = predictedY;
    const currentPosition = ballPosition.y;
    predictedY = currentPosition + (perfectPrediction - currentPosition) * AI_PREDICTION_ACCURACY;
    
    // Agregar factor de confusión
    const confusionRange = AI_CONFUSION_FACTOR * 100; // Rango de confusión en píxeles
    const confusion = (Math.random() - 0.5) * confusionRange;
    predictedY += confusion;
    
    return predictedY;
}

/**
 * Verifica si la bola se mueve hacia el jugador
 */
export function isBallMovingTowardsPlayer(player: Player, ball: Ball): boolean {
    const ballVelocity = ball.velocity;
    const isLeftPlayer = player.position.x < 0;
    
    // Jugador izquierdo: bola debe ir hacia la izquierda (velocidad X negativa)
    // Jugador derecho: bola debe ir hacia la derecha (velocidad X positiva)
    return isLeftPlayer ? ballVelocity.x < 0 : ballVelocity.x > 0;
}

/**
 * Función de debug simplificada
 */
export function getAIDebugInfo(player: Player, ball: Ball): any {
    if (!player.isAI) return null;
    
    const targetY = calculatePredictedPosition(player, ball);
    const direction = calculateAIDirection(player, ball);
    
    return {
        playerId: player.playerId,
        playerY: player.position.y,
        ballY: ball.currentPosition.y,
        predictedY: targetY,
        direction: direction,
        distanceToBall: Math.abs(player.position.x - ball.currentPosition.x),
        ballMovingTowards: isBallMovingTowardsPlayer(player, ball),
        ballVelocity: ball.velocity,
        isTracking: ball.isMoving && ball.isInPlay,
        currentMoving: player.moving
    };
}

/**
 * Configurar dificultad de la IA (función opcional)
 */
export function setAIDifficulty(difficulty: "easy" | "medium" | "hard"): { accuracy: number; confusion: number } {
    switch (difficulty) {
        case "easy":
            return { accuracy: 0.4, confusion: 0.6 };
        case "medium":
            return { accuracy: 0.7, confusion: 0.3 };
        case "hard":
            return { accuracy: 0.9, confusion: 0.1 };
        default:
            return { accuracy: AI_PREDICTION_ACCURACY, confusion: AI_CONFUSION_FACTOR };
    }
}