import { FastifyRequest, FastifyReply } from 'fastify';
import { deployGameContract } from '../services/deployService';

interface DeployRequestBody {
  gameResult: {
    id: number;
    winner: string;
    second: string;
    rest: string;
  };
}

export async function deployHandler(
  request: FastifyRequest<{ Body: DeployRequestBody }>,
  reply: FastifyReply
) {
  const { gameResult } = request.body;
  
  const extRequest = request as FastifyRequest<{ Body: DeployRequestBody }> & { blockchain?: boolean };

  if (!extRequest.blockchain) {
    return reply.code(403).send("Forbidden");
  }

  if (!gameResult || !gameResult.id || !gameResult.winner || !gameResult.second || !gameResult.rest) {
    return reply.code(400).send({
      error: 'Missing game result data',
      required: ['id', 'winner', 'second', 'rest'],
    });
  }

  try {
    const result = await deployGameContract(gameResult);
    return reply.code(200).send(result);
  } catch (error: any) {
    request.log.error(error);
    return reply.code(500).send({
      error: error.message || 'Deployment failed',
    });
  }
}
