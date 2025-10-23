// controllers/socket.controller.ts
import { FastifyRequest } from 'fastify';
import {
	addClient,
	handleIncomingMessage,
	removeClient,
} from '../services/socket.service';
import { reconnectPlayer } from '../services/reconnect.service';

export function websocketConnectionHandler(ws: WebSocket, request: FastifyRequest) {
	if (!request.user)
	{
		ws.close();
		return;
	}

	// const playerId = request.user.id;
	const { sessionId } = request.query as { sessionId?: string };
	if (!sessionId || sessionId.length === 0)
	{
		ws.close();
		return;
	}
	const client = addClient(sessionId, ws);
	//reconnectPlayer(client);

	showmyPongServerInfo();
	
	ws.on('message', (data: string) => handleIncomingMessage(sessionId, data));
	ws.on('close', () => removeClient(sessionId, ws));
}

import { myPongServer } from '../../../game';

function showmyPongServerInfo()
{
	for (const game of myPongServer.games)
	{
		console.log( "Games: " + game.id);
	}
	for (const tournament of myPongServer.tournaments)
	{
		console.log( "Tournaments: " + tournament.id);
	}
	for (const client of myPongServer.clients)
	{
		console.log( "Clients: " + client.playerId);
	}
}