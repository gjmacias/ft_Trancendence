
// services/socket.service.ts
import { queueInput, InputRole, CommandsByRole, isValidInput, isValidStarterInput, InputEvent } from '../../../core/inputs/inputQueue';
import { GameState } from '../../../core/entities/GameState';
import { myPongServer } from '../../../game';
import { PlayerSocket } from '../../../core/entities/PongServer';
import { TICKWAIT } from '../../../core/Constants/Constants';
import { Tournament } from '../../../core/entities/Tournament';
import { Player } from '../../../core/entities/Player';
import { User } from '../../../core/entities/User';

export function addClient(playerId: string, ws: WebSocket) : PlayerSocket
{
	const player: PlayerSocket = { ws, playerId };
	myPongServer.clients.add(player);
	console.log('🔌 Cliente conectado: ' + playerId);
	return player;
}

export function handleIncomingMessage(playerId: string, data: string)
{
	try
	{
		const msg = JSON.parse(data);

		const input: InputEvent = {
			playerId: playerId,
			type: msg.type as InputRole,
			command: msg.command as CommandsByRole[InputRole],
			timestamp: msg.timestamp ?? Date.now(),
		};
		if (input.type === "health" && input.command === "PING")
		{
			broadcastHealthPONG(input.playerId)
			return;
		}
		if ((input.type === "starter" && isValidStarterInput(input.command)) 
			|| isValidInput(input))
			queueInput(input);
		else
			console.warn("⚠️ Comando inválido:", msg);
	} 
	catch (err) 
	{
		console.error("❌ Mensaje WebSocket inválido:", err);
	}
}

export function removeClient(playerId: string, ws: WebSocket)
{
	try
	{
		for (const game of myPongServer.games)
		{
			for (const player of game.players)
			{
				if (player.id === playerId)
				{
					//ELIMINA POR AHORA EL JUEGOS
					player.id = "";
					game.status = "ended";
					break;
				}
			}
		}
		for (const tournament of myPongServer.tournaments)
		{
			for (const player of tournament.allPlayers)
			{
				if (player.id === playerId)
				{
					//ELIMINA POR AHORA EL JUEGOS
					player.id = "";
					tournament.status = "ended";
					break;
				}
			}
		}
		for (const matchmaking of myPongServer.matchmaking)
		{
			let removeMatch = true;
			for (const player of matchmaking.allPlayers)
			{
				if (player.id === playerId)
				{
					//ELIMINA POR AHORA EL JUEGOS
					player.id = "";
				}
				if (player.id !== "")
					removeMatch = false;
			}
			if (removeMatch)
			{
				console.log(" Matchmaking DELETE by NO-USERS: ", matchmaking.id);
				matchmaking.id = "";
				myPongServer.matchmaking.delete(matchmaking);
			} 
		}
		for (const client of myPongServer.clients)
		{
			if (playerId === client.playerId)
			{
				//ELIMINA POR AHORA EL JUEGOS
				myPongServer.clients.delete(client);
				break;
			}
		}
		console.log('❌ Cliente desconectado: ', playerId);
	} 
	catch (error) 
	{
		console.log(error);
	}
}

export function broadcastState(state: GameState)
{
	if (state.tickWait !== TICKWAIT)
	{
		state.tickWait++;
		return;
	}
	state.tickWait = 0;

	let snapshot;
	try {
		snapshot = JSON.stringify(state);
	} catch (e) {
		console.error('Error al hacer stringify:', e);
		return;
	}

	const playerIds = new Set(state.players.map(p => p.id));
	for (const client of myPongServer.clients) {
		if (!playerIds.has(client.playerId)) continue;
		if (client.ws.readyState === client.ws.OPEN)
		{
			client.ws.send(JSON.stringify({ type: 'game:loop', snapshot }));
		}
	}
}

export function broadcastStateSnapshot(state: GameState)
{
	let snapshot;
	try 
	{
		snapshot = JSON.stringify(state);
	} 
	catch (e) 
	{
		console.error('Error al hacer stringify:', e);
		return;
	}

	const playerIds = new Set(state.players.map(p => p.id));
	for (const client of myPongServer.clients) 
	{
		if (!playerIds.has(client.playerId)) continue;
		if (client.ws.readyState === client.ws.OPEN) {
			client.ws.send(JSON.stringify({ type: 'game:loop', snapshot }));
		}
	}
}

export function broadcastTournament(tournament: Tournament)
{
	if (tournament.status === "paused")
	{
		const playerIds = new Set(tournament.allPlayers.map(p => p.id));
		for (const client of myPongServer.clients) {
			if (!playerIds.has(client.playerId)) continue;
			if (client.ws.readyState === client.ws.OPEN) 
			{
				const players = tournament.allPlayers
				client.ws.send(JSON.stringify({ type: 'tournament:pause', players }));
			}
		}
	}
}

export function broadcastTournamentMatch(tournament: Tournament, players : Player[])
{
	if (tournament.status === "paused")
	{
		const playerIds = new Set(tournament.allPlayers.map(p => p.id));
		for (const client of myPongServer.clients) {
			if (!playerIds.has(client.playerId)) continue;
			if (client.ws.readyState === client.ws.OPEN) 
			{
				client.ws.send(JSON.stringify({ type: 'tournament:pause', players }));
			}
		}
	}
}

export function broadcastTournamentResult(tournament: Tournament, winner : Player, runnerUp : Player)
{
	const playerIds = new Set(tournament.allPlayers.map(p => p.id));
	const participants = tournament.allPlayers;
	for (const client of myPongServer.clients) 
	{
		if (!playerIds.has(client.playerId)) continue;
		if (client.ws.readyState === client.ws.OPEN)
		{
			client.ws.send(JSON.stringify({ type: 'tournament:result', results: {winner, runnerUp, participants}}));
		}
	}
}


export function broadcastTournamentBlockchain(tournament: Tournament, blockchainId: any)
{
	const playerIds = new Set(tournament.allPlayers.map(p => p.id));

	for (const client of myPongServer.clients) 
	{
		if (!playerIds.has(client.playerId)) continue;
		if (client.ws.readyState === client.ws.OPEN)
		{
			client.ws.send(JSON.stringify({ type: 'tournament:blockchain', blockchainId: blockchainId}));
		}
	}
}

export function broadcastHealthPONG(clientID: string)
{
	for (const client of myPongServer.clients) 
	{
		if (client.playerId !== clientID)
			continue
		if (client.ws.readyState === client.ws.OPEN)
		{
			client.ws.send("PONG");
		}
	}
}


export function broadcastStartRemote(user: User)
{
	user.ws!.send(JSON.stringify({ type: 'remote:start', sessionId: user.id}));
}

