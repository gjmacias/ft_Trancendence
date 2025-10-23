import { FastifyInstance } from 'fastify';
import { BlockchainTournamentController } from '../controllers/BlockchainTournament.controller';

export async function BlockchainTournamentRoutes(fastify: FastifyInstance)
{
  const controller = new BlockchainTournamentController();

  fastify.post('/tournament', controller.saveBlockchainTournament);
  fastify.get('/tournament/:id', controller.getBlockchainTournament);
}