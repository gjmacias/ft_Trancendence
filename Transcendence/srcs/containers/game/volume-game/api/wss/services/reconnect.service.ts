import { PlayerSocket } from "../../../core/entities/PongServer";
import { myPongServer } from "../../../game";
import { broadcastStateSnapshot, broadcastTournament } from "./socket.service";

export function reconnectPlayer(client: PlayerSocket): boolean
{
	console.log("intentando reconexion: ", client.playerId);
	return (
			reconnectTournament(client) 
		||	reconnectGame(client)
	);
}

function reconnectGame(client: PlayerSocket) : boolean
{
	const game = [...myPongServer.games].find(g =>
		g.players.some(p => p.id === client.playerId)
	);

	if (!game) return false;
	const player = game.players.find(p => p.id === client.playerId);
	if (!player) return false;

	client.gameId = game.id;
	broadcastStateSnapshot(game);
	player.isActive = true;

	return true;
}

function reconnectTournament(client: PlayerSocket) : boolean
{
	const tournament = [...myPongServer.tournaments].find(t =>
		t.allPlayers.some(p => p.id === client.playerId)
	);

	if (!tournament) return false;
	const player = tournament.allPlayers.find(p => p.id === client.playerId);
	if (!player) return false;

	client.tournamentId = tournament.id;
	// broadcastTournament(tournament);
	player.isActive = true;

	return true;
}
