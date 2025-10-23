import { FastifyRequest, FastifyReply } from 'fastify';
import { TournamentService } from '../services/tournament.service';
import { Tournament } from '../../models/tournament.model';
import { tournamentRepository } from '../../../database/repositories-sqlite/tournament.repository';

export class TournamentController
{
	private service: TournamentService;

	constructor() { this.service = new TournamentService(new tournamentRepository); }

	saveTournament = async (request: FastifyRequest, reply: FastifyReply) =>
	{
		if (!request.game)
		{
			return reply.status(403).send({ error: 'Forbbiden' });
		}
		try
		{
			const {winner, second, rest, finished} = request.body;
			const finishedStr = new Date(finished).toISOString();
			const endTournament: Tournament = {
				winner,
				second,
				rest,
				finished: finishedStr
			};
			const id = await this.service.saveTournament(endTournament);
			return reply.status(201).send({ id });
		} catch (error)
		{
			return reply.status(500).send({ error: 'Error saving match' });
		}
	};
}
