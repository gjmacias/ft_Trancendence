import { FastifyPluginAsync } from 'fastify';
import {
	sendMessageController,
	getMessagesBetweenUsersController,
	markMessageAsReadController
} from '../controllers/messages.controller';

const routes: FastifyPluginAsync = async (fastify) => {
	// Enviar mensaje (POST con body)
	fastify.post('/', sendMessageController);

	// Ver historial de mensajes (GET con query params)
	fastify.get('/:senderId/:receiverId/:limit/:offset', getMessagesBetweenUsersController);

	// Marcar mensaje como leído (PUT con param id)
	fastify.put('/:id/read', markMessageAsReadController);
};

export default routes;
