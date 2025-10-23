import { FastifyPluginAsync } from 'fastify';
import { refreshTokenController } from '../controllers/refreshToken.controller';

const routes: FastifyPluginAsync = async (fastify) => 
{
	fastify.post('/refresh-token', refreshTokenController);
};

export default routes;