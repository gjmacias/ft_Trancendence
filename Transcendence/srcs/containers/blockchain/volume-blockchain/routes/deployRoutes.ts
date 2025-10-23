import { FastifyInstance } from 'fastify';
import { deployHandler } from '../controllers/deployControllers';
import { comesFromBlockchain } from '../middleware/internalTokens';

export default async function deployRoutes(fastify: FastifyInstance) {
  fastify.post('/deploy', { preHandler: comesFromBlockchain }, deployHandler as any);
}
