// routes/tournament.routes.ts
import { FastifyInstance } from 'fastify';
import { startTournamentHandler } from './tournament.controller';

export default async function tournamentRoutes(fastify: FastifyInstance) 
{
	fastify.post('/tournament', startTournamentHandler);
}
