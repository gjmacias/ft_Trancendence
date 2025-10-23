// routes.ts
import { FastifyInstance } from 'fastify'
import socketRoutes from './api/wss/routes/socket.route'
import gameonevoneRoutes from './api/https/game/game.route'
import tournametRoutes from './api/https/tournament/tournament.routes'

export default async function Routes(fastify: FastifyInstance)
{
	fastify.register(socketRoutes);
	fastify.register(gameonevoneRoutes);
	fastify.register(tournametRoutes);
}