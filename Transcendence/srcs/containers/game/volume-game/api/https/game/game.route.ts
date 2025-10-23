// routes/game.routes.ts
import { FastifyInstance } from 'fastify';
import { start1v1GameHandler, reconnectHandler, connectRemoteHandler, startRemoteHandler } from './game.controller';

export default async function gameRoutes(fastify: FastifyInstance) {
	fastify.post('/1v1/:mode', start1v1GameHandler);
	fastify.post('/reconnect', reconnectHandler);

	fastify.post('/connect-remote', connectRemoteHandler);
	fastify.post('/start-remote', startRemoteHandler);
}
