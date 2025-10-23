
import { normalize, sleep } from './Utils';
import { Field } from "./Field";
import { Ball, resetBall, createNewBall } from "./Ball";
import { Player } from "./Player";
import { Light } from "./Light";
import { PowerUp } from "./PowerUp";
import { Camera } from "./Camera";
import { GameConfiguration } from "./GameConfiguration";
import { ManagerCollisionsBallvBall, ManagerCollisionsBallvPlayer, ManagerCollisionsBallvField } from '../managers/CollitionsManager/ManagerCollitions';
import { ManagerMovement } from '../managers/MovementManager/MoveManager';
import { ONE_SECOND, TIME_GAME_PAUSED, TIME_GAME_WAITING } from '../Constants/Constants';
import { ManagerAIs } from '../managers/AIManager/ManagerAIs';
import { consumeInputs } from '../inputs/inputQueue'

export type StatusGame = "waiting" | "running" | "paused" | "ended";

export class GameState 
{
	id: string; // ID del match o estado
	timestamp: number; // UNIX timestamp o delta para sincronización
	isReadyTimestamp: number; // UNIX timestamp o delta para sincronización
	camera: Camera; // Única, puede ser ortográfica o perspectiva
	field: Field; // Único
	players: Player[]; // dinámico, indexado por ID
	balls: Ball[]; // dinámico, indexado por ID
	lights: Light[]; // dinámico, indexado por ID
	powerUps: PowerUp[]; // activos en la partida
	events: any[]; // eventos del juego, como colisiones, power-ups, etc.
	status: StatusGame;
	winner: Player | null; // Jugador ganador, si aplica
	configuration: GameConfiguration;
	tickWait: number;

	async updatePhysics()
	{
		//ManagePowerUpEffects(Object.values(this.players), this);
		ManagerAIs(this);
		ManagerMovement(this);
		for (const ball of Object.values(this.balls) as Ball[])
		{
			if (!ball.isActive) continue;
			// Colisión contra jugadores
			ManagerCollisionsBallvBall(ball, this.balls, this);
			ManagerCollisionsBallvPlayer(ball, this.players);
			ManagerCollisionsBallvField(ball, this.field, this);
		}
	}

	async reactivateGame()
	{
		if ((this.status === "waiting" && this.playersAreActive())
			|| (this.status === "paused" && this.playersAreReady()))
		{
			this.status = "running";
			await sleep(ONE_SECOND);
		}
		consumeInputs(this.players);
	}

	numberActivePlayers(): number {
		return this.players.filter(p => p.isActive).length;
	}

	playersAreActive() : boolean
	{
		if ((Date.now() - this.timestamp ) > TIME_GAME_WAITING)
			return true;
		for (const player of this.players)
		{
			if (!player.isActive)
				return false;
		}
		return true;
	}
	
	playersAreReady() : boolean
	{
		if ((Date.now() - this.isReadyTimestamp) > TIME_GAME_PAUSED)
			return true;
		for (const player of this.players)
		{
			if (!player.isReady)
				return false;
		}
		return true;
	}
}

// Helper to get ball array from GameState.balls object
function getBallArray(gameState: GameState): Ball[] {
	return Object.values(gameState.balls);
}

function resetAllBalls(gameState: GameState) {
	const ballsArray = getBallArray(gameState);

	// Remove all extra balls (keep only the first one)
	const firstBallId = ballsArray[0]?.id;
	for (const id in gameState.balls) {
		if (Number(id) !== firstBallId) {
			const ball = gameState.balls[id];
			ball.trail?.stop?.();
			delete gameState.balls[id];
		}
	}

	if (firstBallId) {
		resetBall(gameState.balls[firstBallId]);
	}

	updateBallCountUI(Object.keys(gameState.balls).length);
}

function updateBallCountUI(count: number) {
	const ballCountEl = document.getElementById('ballCount');
	if (ballCountEl) {
		ballCountEl.textContent = `Bol${count === 1 ? 'a' : 'as'}: ${count}`;
	}
}

function addBall(gameState: GameState) {
	if (gameState.status === "running") {
		const ballsArray = getBallArray(gameState);
		const baseBall = ballsArray[0];

		const newBall = createNewBall(ballsArray.length);
		newBall.position = { ...baseBall.position };
		newBall.direction = {
			x: Math.random() > 0.5 ? 1 : -1,
			y: 0,
			z: (Math.random() - 0.5) * 0.5,
		};
		newBall.direction = normalize(newBall.direction);

		gameState.balls[newBall.id] = newBall;
		updateBallCountUI(Object.keys(gameState.balls).length);
	}
}

function removeBall(gameState: GameState) {
	const ballIds = Object.keys(gameState.balls);
	if (ballIds.length > 1 && gameState.status === "running") {
		const lastBallId = ballIds[ballIds.length - 1];

		const ballToRemove = gameState.balls[lastBallId];
		ballToRemove.trail?.stop?.();
		delete gameState.balls[lastBallId];
		updateBallCountUI(ballIds.length - 1);
	}
}

function getBallCount(gameState: GameState): number {
	return Object.keys(gameState.balls).length;
}

export {
  resetAllBalls,
  addBall,
  removeBall,
  getBallCount
};