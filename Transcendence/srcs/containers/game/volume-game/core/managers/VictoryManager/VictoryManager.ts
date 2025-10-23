import { BALLS_MAX_SPEED } from "../../Constants/ConstBall";
import { GameState } from "../../entities/GameState";
import { Player } from "../../entities/Player";

/*
 * Función auxiliar para verificar condiciones de victoria
*/
export function ManagerVictory(gameState: GameState): boolean
{
	//checkTimeConditions(gameState)
	if (checkScoreConditions(gameState))
	{
		return true;
	}
	return false;
}

function checkScoreConditions(gameState: GameState): boolean
{
	if (gameState.configuration.type !== "1v1") return false;

	let iterator = 0;
	for (const player of gameState.players) 
	{
		if (player.score === gameState.configuration.winScore) 
		{
			return GameIsOver(player, gameState);
		}
		iterator++;
	}
	return false;
}

function checkTimeConditions(gameState: GameState): boolean
{
	if (Date.now() - gameState.timestamp > gameState.configuration.maxTime)
	{
		let maxScore = -1;
		let repeatPlayers = 0;
		for (const player of gameState.players)
		{
			if (maxScore < player.score)
			{
				maxScore = player.score;
				repeatPlayers++;
			}
		}
		if (repeatPlayers)
		{
			GameMustOver(maxScore, gameState);
		}
	}
	return false;
}

function GameIsOver(winner : Player, gameState: GameState) : boolean
{
	gameState.winner = winner;
	gameState.status = "ended";
	
	// Emitir evento de victoria
	gameState.events?.push({
	type: "game_over",
	winnerId: winner.id,
	winnerNick: winner.nickname,
	finalScore: [gameState.players[0].score, gameState.players[1].score],
	timeMatch: Date.now() - gameState.timestamp
	});	
	return true;
}

function GameMustOver(maxScore : number, gameState: GameState) 
{
	gameState.configuration.winScore = maxScore + 1;
	gameState.configuration.maxTime = Infinity;
	for(const ball of gameState.balls)
	{
		if (ball.speed !== 0)
			ball.speed = BALLS_MAX_SPEED;
	}
}