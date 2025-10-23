import { FastifyInstance } from 'fastify';
import {TournamentController} from '../controllers/tournament.controller';

export async function TournamentRoutes(fastify: FastifyInstance)
{
  const controller = new TournamentController();

  fastify.post('/tournament', controller.saveTournament);
}