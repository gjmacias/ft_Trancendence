import { FastifyRequest, FastifyReply } from 'fastify';
import { MessagesService } from '../services/messages.service';
import { MessagesRepository } from "../../../database/repositories-sqlite/messages.repository";

const messagesService = new MessagesService(new MessagesRepository());

export async function sendMessageController(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { sender_id, receiver_id, content } = request.body as {
			sender_id: string;
			receiver_id: string;
			content: string;
		};

		if (!sender_id || !receiver_id || !content) {
			return reply.status(400).send({ error: 'Missing required fields' });
		}

		const id  = await messagesService.sendMessage(sender_id, receiver_id, content);

		reply.status(201).send({ id, message: 'Message sent successfully' });
	} catch (err: any) {
		reply.status(500).send({ error: err.message });
	}
}

export async function getMessagesBetweenUsersController(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { senderId, receiverId, limit = '20', offset = '0' } = request.params as {
			senderId: string;
			receiverId: string;
			limit?: string;
			offset?: string;
		};
		
		if (!senderId || !receiverId) {
			return reply.status(400).send({ error: 'Missing senderId or receiverId' });
		}

		// Convertir a números
		const senderIdNum = senderId;
		const receiverIdNum = receiverId;
		const limitNum = Number(limit);
		const offsetNum = Number(offset);

		const messages = await messagesService.getConversation(senderIdNum, receiverIdNum, limitNum, offsetNum);

		reply.status(200).send(messages);
	} catch (err: any) {
		reply.status(500).send({ error: err.message });
	}
}

export async function markMessageAsReadController(request: FastifyRequest, reply: FastifyReply) {
	try
	{
		const { sender_id, receiver_id } = request.body as {
			sender_id: string;
			receiver_id: string;
		};

		if (!sender_id || !receiver_id) {
			return reply.status(400).send({ error: 'Missing required fields' });
		}
		const result = await messagesService.markAsRead(sender_id, receiver_id);

		reply.status(200).send(result);
	} catch (err: any) {
		reply.status(500).send({ error: err.message });
	}
}
