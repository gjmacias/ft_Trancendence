// routes/socket.routes.ts
import { FastifyInstance } from 'fastify';
import { websocketConnectionHandler } from '../controllers/socket.controller';

export default async function socketRoutes(fastify: FastifyInstance) {
	fastify.get('/wss', { websocket: true }, websocketConnectionHandler);
}
