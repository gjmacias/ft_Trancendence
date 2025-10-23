// controllers/game.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { startGame, reconnectPlayer } from './game.service';
import { User } from '../../../core/entities/User';
import { matchmakingConnectGame, matchmakingCreateGame, matchmakingStartGame } from '../../../core/game/matchmacking/MatchmakingBeta';
import { myPongServer } from '../../../game';

export async function start1v1GameHandler(request: FastifyRequest, reply: FastifyReply) {
	if (!request.user)
	{
		return reply.status(401).send({ error: 'Forbidden' });
	}
	try 
	{
		// if (reconnectPlayer(request.user.id))
		// {
		//	return reply.status(403).send({ error: 'You are IN a Game'});
		// }
		const { mode } = request.params as { mode: string };
		const { sessionId } = request.body as { sessionId: string };
		if (!sessionId || sessionId.length === 0) {
			return reply.status(400).send({ error: 'sessionId is required' });
		}
		const client = [...myPongServer.clients].find(c => c.playerId === sessionId);
		if (!client) {
			return reply.status(400).send({ error: 'WebSocket connection not found for this sessionId' });
		}

		const { nickname } = request.user;
		const user: User = { id: sessionId, nickname };

		startGame(mode, user);
		return reply.status(210).send({ message: 'Juego iniciado' });
	} catch (error) {
		return reply.status(400).send({ error: 'Modo no soportado' });
	}
}

export async function reconnectHandler(request: FastifyRequest, reply: FastifyReply) {
	if (!request.user) 
	{
		return reply.status(403).send({ error: 'Forbidden' });
	}

	try
	{
		if (reconnectPlayer(request.user.id))
		{
			return reply.status(210).send('Reconnecting');
		}
		return reply.status(200).send('Clean');
	} 
	catch (error) 
	{
		return reply.status(500).send({ error: 'Internal Error' });
	}
}

export async function connectRemoteHandler(request: FastifyRequest, reply: FastifyReply) 
{
	if (!request.user) 
	{
		return reply.status(403).send({ error: 'Forbidden' });
	}
	try
	{
		const { matchmakingId } = request.body;
		const { sessionId } = request.body as { sessionId: string };
		if (!sessionId || sessionId.length === 0)
		{
			return reply.status(400).send({ error: 'sessionId is required' });
		}

		const { nickname } = request.user;
		const user: User = { id: sessionId, nickname };

		if(matchmakingId === "")
		{
			return reply.status(201).send({ matchmakingId: await matchmakingCreateGame(user) });
		}
		if(await matchmakingConnectGame(matchmakingId, user))
			return reply.status(200).send('Connected');
		else
			return reply.status(403).send('Forbidden');
	} 
	catch (error) 
	{
		return reply.status(500).send({ error: 'Internal Error' });
	}
}

export async function startRemoteHandler(request: FastifyRequest, reply: FastifyReply) 
{
	if (!request.user) 
	{
		return reply.status(403).send({ error: 'Forbidden' });
	}
	try
	{
		const {matchmakingId} = request.body;
		const { sessionId } = request.body as { sessionId: string };

		const client = [...myPongServer.clients].find(c => c.playerId === sessionId);
		if (!client) {
			return reply.status(400).send({ error: 'WebSocket connection not found for this sessionId' });
		}

		if(await matchmakingStartGame(matchmakingId, sessionId))
			return reply.status(200).send('started');
		else
			return reply.status(403).send('Forbidden');
	} 
	catch (error) 
	{
		return reply.status(500).send({ error: 'Internal Error' });
	}
}
