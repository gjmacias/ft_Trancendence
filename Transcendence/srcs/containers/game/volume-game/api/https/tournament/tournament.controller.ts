// controllers/tournament.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { startTournament, reconnectTournamentPlayer } from './tournament.service';
import { User } from '../../../core/entities/User';
import { prepareLocalTournament } from './tournament.service';

interface TournamentBody 
{
	mode: string;
	users: User[];
}

export async function startTournamentHandler(request: FastifyRequest, reply: FastifyReply) {
	if (!request.user) 
	{
		return reply.status(403).send({ error: 'Forbidden' });
	}
	try 
	{
		const { sessionId } = request.body as { sessionId: string };
		if (!sessionId || sessionId.length === 0) {
			return reply.status(400).send({ error: 'sessionId is required' });
		}
		const { registry } = request.body as { registry: TournamentBody };
		const { mode, users } = registry;
		
		if (!checkAreEnoughUsers(users))
			return reply.status(404).send({ error: 'Not enough players' });
		if (!checkAreCorrectNickUsers(users))
			return reply.status(404).send({ error: 'Error: Large Nick players' });
		if (duplicatedNicknameUsers(users))
			return reply.status(404).send({ error: 'Has duplicated players' });
		if (reconnectTournamentPlayer(sessionId))
			return reply.status(403).send({ error: 'You are In other tournament' });
		if ( mode === "local")
			await prepareLocalTournament(users, sessionId);

		reply.status(200).send({ message: 'Torneo iniciado' });
		await startTournament(mode, users);
	}
	catch (error) 
	{
		return reply.status(400).send({ error: 'Modo no soportado' });
	}
}

function checkAreEnoughUsers(users: User[]): boolean
{
	if (users.length <= 2 || users.length > 32)
		return false;
	return true;
}


function checkAreCorrectNickUsers(users: User[]): boolean
{
	for (const user of users)
	{
		if (user.nickname.length > 20)
			return false;
	}
	return true;
}


function duplicatedNicknameUsers(users: User[]): boolean
{
	const seen = new Set<string>();

	for (const user of users)
	{
		if (seen.has(user.nickname))
		{
			return true;
		}
		seen.add(user.nickname);
	}
	return false;
}
