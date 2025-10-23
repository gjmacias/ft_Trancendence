import { GameState } from "../../entities/GameState"
import { consumeInputs } from '../../inputs/inputQueue'
import { broadcastState, broadcastStateSnapshot } from '../../../api/wss/services/socket.service'
import { TICK } from "../../Constants/Constants"
import { processInputsGame } from "../../inputs/InputProcessGame"
import { ManagerVictory } from "../../managers/VictoryManager/VictoryManager"

export async function GameLoop(gameState: GameState): Promise<void> {
	return new Promise<void>((resolve) => {
		try 
		{
			broadcastStateSnapshot(gameState);
			const loop = async () => {
				const startTime = Date.now();
				const inputs = consumeInputs(gameState.players);
				processInputsGame(inputs, gameState);

				if (gameState.winner || gameState.status === "ended") {
					broadcastStateSnapshot(gameState);
					resolve(); // ✅ Se resuelve cuando termina el juego
					return;
				}
				if (gameState.status === "waiting" || gameState.status === "paused") {
					gameState.reactivateGame();
				}	
				if (gameState.status === "running") {
					gameState.updatePhysics();
					broadcastState(gameState);
				}

				ManagerVictory(gameState);
				const timeTaken = Date.now() - startTime;
				const delay = Math.max(0, TICK - timeTaken);
				if (delay === 0)
					console.log(`❌Has taken too much: ${timeTaken} -> ${TICK}`);
				
				setTimeout(loop, delay);
			};
			loop();		
		} 
		catch (error)
		{
			console.error(error);
		}
	});
}
