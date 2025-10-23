import { FastifyRequest, FastifyReply } from 'fastify';
import { MatchService } from '../services/match.service';
import { Match } from '../../models/match.model';

export class MatchController
{
	private service: MatchService;

	constructor() { this.service = new MatchService(); }

	getLastMatches = async (request: FastifyRequest, reply: FastifyReply) =>
	{
		const playerId = (request.params as any).playerId;

		if (isNaN(playerId))
			return reply.status(400).send({ error: 'Invalid player ID' });
		try
		{
			const matches = await this.service.getLastMatchesByPlayerId(playerId);
			return reply.send(matches);
		} catch (error)
		{
			return reply.status(500).send({ error: 'Error getting matches' });
		}
	};

	saveMatch = async (request: FastifyRequest, reply: FastifyReply) =>
	{
		const body = request.body as Match;

		if (!body.player1_id ||
			!body.player2_id ||
			typeof body.score1 !== 'number' ||
			typeof body.score2 !== 'number')
		{
			return reply.status(400).send({ error: 'Missing required fields' });
		}
		try
		{
			const id = await this.service.save(body);
			return reply.status(201).send({ id });
		} catch (error) {
			return reply.status(500).send({ error: 'Error saving match' });
		}
	};
}
