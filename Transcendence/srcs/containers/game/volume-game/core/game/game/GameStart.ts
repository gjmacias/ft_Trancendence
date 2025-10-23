import { LocalStartState } from "./startStates/StartState.Local";
import { RemoteStartState } from "./startStates/StartState.Remote";
import { GameLoop } from "./GameLoop";
import { GameConfiguration } from "../../entities/GameConfiguration";
import { Player } from "../../entities/Player";
import { GameState } from "../../entities/GameState";
import { GameEnd } from "./GameEnd";
import { myPongServer } from "../../../game";

export async function gameStart(configuration: GameConfiguration, players: Player[]) : Promise<string | null>
{
	if (players.length === 0)
	{
		console.error("no se ha unido ningun player");
		return null;
	}
	let gameState : GameState;

	if (!configuration.cloudConection)
	{
		gameState = LocalStartState(configuration, players);
	}
	else
	{
		gameState = RemoteStartState(configuration, players);
	}
	addInformation(gameState);
	console.log("Game Started: ", gameState.id);
	await GameLoop(gameState);
	console.log("Game Ended: ", gameState.id);
	const winner = (gameState.winner?.id) ? gameState.winner.id : null;
	await GameEnd(players, gameState);
	return winner;
}

function addInformation(gameState : GameState)
{
	myPongServer.games.add(gameState);

  	const playerIds = new Set(gameState.players.map(p => p.id))
	for (const client of myPongServer.clients)
	{
		if (!playerIds.has(client.playerId)) continue
		client.gameId = gameState.id;
	}
}
