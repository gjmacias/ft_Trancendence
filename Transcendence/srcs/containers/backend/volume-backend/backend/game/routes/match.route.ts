import { FastifyInstance } from 'fastify';
import {MatchController} from '../controllers/match.controller';

export async function matchRoutes(fastify: FastifyInstance)
{
  const controller = new MatchController();

  fastify.get('/matches/:playerId', controller.getLastMatches);
  fastify.post('/matches', controller.saveMatch);
}