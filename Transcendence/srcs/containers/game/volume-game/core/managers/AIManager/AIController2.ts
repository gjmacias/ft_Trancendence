import { Player } from "../../entities/Player";
import { Ball } from "../../entities/Ball";
import { AI_REACTION_DISTANCE } from '../../Constants/ConstAI';
import { Vector3 } from "../../entities/Vector3";
import { FIELD_NORMAL_HEIGHT, FIELD_NORMAL_WIDTH } from "../../Constants/ConstFieldWall";
import { isBallMovingTowardsPlayer } from "./AIController";
import { PLAYER_NORMAL_HEIGHT } from "../../Constants/ConstPlayer";
import { BALLS_NORMAL_RADIUS } from "../../Constants/ConstBall";

/**
 * Actualiza el movimiento del jugador IA usando solo player.moving
 * @param player Player IA que se va a mover
 * @param ball Bola principal que debe seguir la IA
 * @param field Campo del juego (no usado por ahora)
 * @param dt Delta time (no usado, movement manager se encarga)
 */
export function updatePlayerAI2(
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

    const distanceToBall = Math.abs(player.position.x - ball.position.x);
    if (distanceToBall > AI_REACTION_DISTANCE) {
        return ; // Muy lejos, no hacer nada
    }
    
    // Verificar si la bola se mueve hacia el jugador
    if (!isBallMovingTowardsPlayer(player, ball)) {
        return; // La bola se aleja, no seguir
    }

    player.setpoint = calcularRebote(ball);
}

/**
 * Calcula la posición Y predicha donde estará la bola
 */
function calcularRebote(ball: Ball): Vector3 {
    let position = { ...ball.position };
    let direccion = { ...ball.direction};

    let salir = false;
    while (!salir) {
        // Cálculo de los tiempos de colisión con cada pared
        const timeLeft = (-(FIELD_NORMAL_WIDTH / 2) - position.x) / direccion.x;
        const timeRight = ((FIELD_NORMAL_WIDTH / 2) - position.x) / direccion.x;
        const timeBottom = (-(FIELD_NORMAL_HEIGHT / 2) - position.y) / direccion.y;
        const timeTop = ((FIELD_NORMAL_HEIGHT / 2) - position.y) / direccion.y;

        // Calculamos el mínimo tiempo de colisión positivo
        const timeMin = Math.min(
            ...[timeLeft, timeRight, timeBottom, timeTop].filter(t => t > 0)
        );

        if (timeMin === Infinity) {
            // No hay colisión futura
            salir = true;
        }

        // Actualizar la posición
        position.x = position.x + direccion.x * timeMin;
        position.y = position.y + direccion.y * timeMin;

        // Verificamos qué pared fue golpeada
        if (timeMin === timeLeft) {
            direccion = calcularReflect(direccion, { x: -1, y: 0, z: 0 });
        } else if (timeMin === timeRight) {
            direccion = calcularReflect(direccion, { x: 1, y: 0, z: 0 });
            salir = true;  // Detenemos cuando se golpea la pared derecha
        } else if (timeMin === timeBottom) {
            direccion = calcularReflect(direccion, { x: 0, y: 1, z: 0 });
        } else if (timeMin === timeTop) {
            direccion = calcularReflect(direccion, { x: 0, y: -1, z: 0 });
        }
    }

    if (position.y + (BALLS_NORMAL_RADIUS * 2) > FIELD_NORMAL_HEIGHT / 2)
        position.y -= (BALLS_NORMAL_RADIUS * 2)
    if (position.y - (BALLS_NORMAL_RADIUS * 2) < -FIELD_NORMAL_HEIGHT / 2)
        position.y += (BALLS_NORMAL_RADIUS * 2)
    console.log("Esta es la posición final:", position);
    return position;
}

function calcularReflect(direccion: Vector3, normal: Vector3): Vector3 {
    // Reflexión estándar de un vector contra una normal
    const dotProduct = direccion.x * normal.x + direccion.y * normal.y + direccion.z * normal.z;
    return {
        x: direccion.x - 2 * dotProduct * normal.x,
        y: direccion.y - 2 * dotProduct * normal.y,
        z: direccion.z - 2 * dotProduct * normal.z
    };
}


export async function goToSetpoint(player: Player) 
{
    const playerPosition = player.position.y;
    const playerAIPosition = player.setpoint.y;
    const playerSize = player.size.height / 2;

    if ((playerPosition - playerSize) > playerAIPosition)
        player.moving = 1;
    else if ((playerPosition + playerSize) < playerAIPosition)
        player.moving = -1;
    else
        goToSetpoint2(player)
}

function goToSetpoint2(player: Player) 
{
    const playerPosition = player.position.y;
    const playersetPosition = player.setpoint.y;
    const playerSize = player.size.height / 2;
    const speed = player.speed;

    if ((playerPosition - playerSize) < playersetPosition && speed > 0)
        player.moving = -1;
    else if ((playerPosition + playerSize) > playersetPosition && speed < 0)
        player.moving = 1;
    else
        player.moving = 0;
}
