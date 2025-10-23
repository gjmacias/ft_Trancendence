// routes.ts
import { FastifyInstance } from 'fastify'

import authRoutes from './backend/authentication/routes/auth.route'
import refreshTokenRoutes from './backend/authentication/routes/refereshToken.route'
import modifyUserRoutes from './backend/authentication/routes/modifyUser.route'
import { BlockchainTournamentRoutes } from './backend/blockchain/routes/BlockchainTournament.route'
import friendshipRoutes from './backend/friendsAndChat/routes/friendships.route'
import messagesRoutes from './backend/friendsAndChat/routes/messages.route'
import {matchRoutes} from './backend/game/routes/match.route'
import stadisticsRoutes from './backend/game/routes/stadistics.route'
import { TournamentRoutes } from './backend/game/routes/tournament.route'

export default async function Routes(fastify: FastifyInstance)
{
	// Auth
	fastify.register(authRoutes, { prefix: '/auth' })
	fastify.register(refreshTokenRoutes, { prefix: '/auth' })
	fastify.register(modifyUserRoutes, { prefix: '/auth/update' })

	// Blockchain
	fastify.register(BlockchainTournamentRoutes, { prefix: '/blockchain' })

	// // Friends and Chat
	// fastify.register(friendshipRoutes, { prefix: '/friends' })
	// fastify.register(messagesRoutes, { prefix: '/messages' })

	// Game
	fastify.register(matchRoutes, { prefix: '/game' })
	fastify.register(stadisticsRoutes, { prefix: '/game' })
	fastify.register(TournamentRoutes, { prefix: '/game' })
}