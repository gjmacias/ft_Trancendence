import { Ball } from "../../entities/Ball";
import { Player } from "../../entities/Player";
import { GameState } from "../../entities/GameState";
import { Wall } from "../../entities/Field";
import { calculateBounceAngle, clamp, massBall, normalize, resetGameStateAfterPoint, rotatePoint, rotatePointInverse } from "../../entities/Utils";
import { POWERUP_MAX_SIZE } from "../../Constants/ConstPowerUp";
import { BALLS_MAX_SPEED } from "../../Constants/ConstBall";
import { closestPointOnLine } from "../hitsManager/HitUtils"
import { broadcastStateSnapshot } from "../../../api/wss/services/socket.service";

export async function hitBallAndBall(ballA: Ball, ballB: Ball): Promise <void> {
	const dx = ballB.position.x - ballA.position.x;
	const dy = ballB.position.y - ballA.position.y;
	const distance = Math.hypot(dx, dy);

	if (distance === 0) return;

	const normalX = dx / distance;
	const normalY = dy / distance;

	// Convert direction + speed to velocity components
	let velAX = ballA.direction.x * ballA.speed;
	let velAY = ballA.direction.y * ballA.speed;
	let velBX = ballB.direction.x * ballB.speed;
	let velBY = ballB.direction.y * ballB.speed;

	const relVelX = velAX - velBX;
	const relVelY = velAY - velBY;

	const velocityAlongNormal = relVelX * normalX + relVelY * normalY;

	if (velocityAlongNormal >= 0) return;

	const restitution = 1.0;

	const invMassA = 1 / massBall(ballA.radius);
	const invMassB = 1 / massBall(ballB.radius);

	const impulseScalar = -(1 + restitution) * velocityAlongNormal / (invMassA + invMassB);

	const impulseX = impulseScalar * normalX;
	const impulseY = impulseScalar * normalY;

	velAX += impulseX * invMassA;
	velAY += impulseY * invMassA;
	velBX -= impulseX * invMassB;
	velBY -= impulseY * invMassB;

	// Convert back to direction + speed
	ballA.speed = Math.hypot(velAX, velAY);
	ballA.direction.x = ballA.speed !== 0 ? velAX / ballA.speed : 0;
	ballA.direction.y = ballA.speed !== 0 ? velAY / ballA.speed : 0;

	ballB.speed = Math.hypot(velBX, velBY);
	ballB.direction.x = ballB.speed !== 0 ? velBX / ballB.speed : 0;
	ballB.direction.y = ballB.speed !== 0 ? velBY / ballB.speed : 0;

	// Position correction
	const overlap = ballA.radius + ballB.radius + 1 - distance;
	const correctionFactor = 1;
	const correctionX = correctionFactor * overlap * normalX;
	const correctionY = correctionFactor * overlap * normalY;

	ballA.position.x -= correctionX * invMassA / (invMassA + invMassB);
	ballA.position.y -= correctionY * invMassA / (invMassA + invMassB);
	ballB.position.x += correctionX * invMassB / (invMassA + invMassB);
	ballB.position.y += correctionY * invMassB / (invMassA + invMassB);
	//applyCollisionEffects(ballA, ballB, normalX, normalY);
	return;
}

export function hitBallAndPowerUp(ball: Ball, powerUp: Ball, gameState: GameState): void {
	// Verificar que el powerUp esté activo y sea del role "powerup"
	if (!powerUp.isActive || powerUp.role !== "powerup" || ball.owner === "") return;
	
	const player = gameState.players.find(p => p.id === ball.owner);
	if (player && player.powerUps.length < POWERUP_MAX_SIZE)
		player.powerUps.push(powerUp.powerUp);

	//Elimina la bola powerup (filtra y recoge todas menos powerUp) 
	gameState.balls = gameState.balls.filter(b => b.id !== powerUp.id);
	
	// Emitir evento de power-up recogido
	gameState.events?.push({
		type: "powerup_collected",
		ballId: ball.id,
		powerUpId: powerUp.id,
		timestamp: Date.now()
	});
}

export function hitBallAndPlayer(ball: Ball, player: Player): void 
{
	if (!ball.isActive || !player.isActive) return;

	// Rotación del jugador (en radianes)
	const rotation = player.rotation;

	// Posición de la bola relativa al jugador
	const relX = ball.position.x - player.position.x;
	const relY = ball.position.y - player.position.y;

	// Transformar la posición de la bola al espacio local del jugador
	const localBall = rotatePointInverse(relX, relY, rotation);

	const halfH = player.size.height / 2;
	const halfW = player.size.width / 2;

	// Clamp en el espacio local
	const clampedLocal = {
		x: clamp(localBall.x, -halfH, halfH),
		y: clamp(localBall.y, -halfW, halfW)
	};

	// Transformar el punto clamped de vuelta al mundo global
	const clampedWorld = rotatePoint(clampedLocal.x, clampedLocal.y, rotation);
	const closestPoint = {
		x: player.position.x + clampedWorld.x,
		y: player.position.y + clampedWorld.y
	};

	// Dirección desde el punto más cercano hacia la bola
	const separationDir = normalize({
		x: ball.position.x - closestPoint.x,
		y: ball.position.y - closestPoint.y
	});

	// Separar la bola
	const separationDistance = ball.radius + 0.1;
	ball.position.x = closestPoint.x + separationDir.x * separationDistance;
	ball.position.y = closestPoint.y + separationDir.y * separationDistance;

	// Dirección de rebote (usando tu lógica actual)
	const bounceAngle = calculateBounceAngle(ball, player, ball.position);
	ball.direction = bounceAngle;
	ball.owner = player.id;

	ball.ballSpeed = Math.min(ball.ballSpeed * 1.05, BALLS_MAX_SPEED);
}

export function hitBallAndWall(ball: Ball, wall: Wall): void 
{
	// Verificar que la bola esté activa
	if (!ball.isActive) return;
	
	// Calcular vector normal de la pared
	const wallVector = {
		x: wall.end.position.x - wall.start.position.x,
		y: wall.end.position.y - wall.start.position.y
	};
	
	// Normal perpendicular a la pared (2D -> 3D)
	const wallLength = Math.sqrt(wallVector.x ** 2 + wallVector.y ** 2);
	const normal = {
		x: wallVector.y / wallLength, // Perpendicular
		y: - wallVector.x / wallLength,
		z: 0
	};
	// Reflejar la dirección según la normal
	const dotProduct = ball.direction.x * normal.x + ball.direction.y * normal.y + ball.direction.z * normal.z;
	
	ball.direction.x = ball.direction.x - 2 * dotProduct * normal.x;
	ball.direction.y = ball.direction.y - 2 * dotProduct * normal.y;
	ball.direction.z = ball.direction.z - 2 * dotProduct * normal.z;
	
	// Separar la bola de la pared
	const closestPoint = closestPointOnLine(wall.start.position, wall.end.position, ball.position);
	const diff = {
		x: ball.position.x - closestPoint.x,
		y: ball.position.y - closestPoint.y
	};
	const dist = Math.sqrt(diff.x ** 2 + diff.y ** 2);
	if (dist !== 0) {
		const correction = (ball.radius - dist);
		ball.position.x += (diff.x / dist) * correction;
		ball.position.y += (diff.y / dist) * correction;
	}
	
	// Aplicar efectos especiales según wall.role
	if (wall.role === "bounce")
		ball.ballSpeed = Math.min(ball.ballSpeed * 1.5, BALLS_MAX_SPEED);
	else if (wall.role === "normal")
		ball.ballSpeed = Math.min(ball.ballSpeed * 1.1, BALLS_MAX_SPEED);
}

	// Encontrar el jugador opuesto para dar el punto
		// Incrementar puntuación del jugador opuesto
	// Verificar condiciones de victoria
		// Resetear para el siguiente punto
	// Emitir evento de puntuación

export function hitBallToWallScore1v1(player: Player, gameState: GameState): void
{
	gameState.status = "paused";
	gameState.tickWait = 0;
	gameState.isReadyTimestamp = Date.now();

	if (gameState.players[0].id === player.id)
		gameState.players[1].score += 1;
	else
		gameState.players[0].score += 1;
	resetGameStateAfterPoint(gameState);
	broadcastStateSnapshot(gameState);
}

export function hitBallToWallScoreTeams(wall: Wall, gameState: GameState): void
{
	gameState.status = "paused";
	gameState.tickWait = 0;
	gameState.isReadyTimestamp = Date.now();

	for (const winnerWall of gameState.field.walls)
	{
		if (winnerWall.role == "playerIn" && winnerWall !== wall)
		{
			for (const winnerplayer of winnerWall.players)
				winnerplayer.score += 1;
		}
	}
	
	resetGameStateAfterPoint(gameState);
	broadcastStateSnapshot(gameState);
}