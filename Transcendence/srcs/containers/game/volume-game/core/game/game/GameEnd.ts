import { myPongServer } from "../../../game";
import { GameState } from "../../entities/GameState";
import { Player } from "../../entities/Player";

export async function GameEnd(players: Player[], gameState : GameState)
{
	for (const client of myPongServer.clients)
	{
		if (players.some(p => p.id === client.playerId))
		{
			client.gameId = undefined;
		}
	}
	// Eliminar el juego
	for (const player of gameState.players)
	{
		player.score = 0;
	}
	myPongServer.games.delete(gameState);
}