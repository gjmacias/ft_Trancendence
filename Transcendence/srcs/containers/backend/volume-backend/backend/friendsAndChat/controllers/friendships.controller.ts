import { FastifyRequest, FastifyReply } from 'fastify';
import { FriendshipsService } from '../services/friendships.service';
import { FriendshipsRepository } from "../../../database/repositories-sqlite/friendships.repository";

// Instanciar servicio con repositorio (puedes mover esto a un container si usas inyección)
const friendshipsService = new FriendshipsService(new FriendshipsRepository());

//  1. Enviar solicitud de amistad
export const sendFriendRequestController = async (
	request: FastifyRequest<{ Body: { requesterId: number; addresseeId: number } }>,
	reply: FastifyReply
	) => {
	const { requesterId, addresseeId } = request.body;

	if (!requesterId || !addresseeId) {
		return reply.status(400).send({ error: 'Faltan campos obligatorios' });
	}

	try {
		const id = await friendshipsService.sendFriendRequest(requesterId, addresseeId);
		reply.status(201).send({ friendshipId: id });
	} catch (err: any) {
		reply.status(400).send({ error: err.message });
	}
};

//  2. Responder a solicitud de amistad
export const respondToFriendRequestController = async (
	request: FastifyRequest<{ Body: { currentUserId: number; requesterId: number; status: 'accepted' | 'cancelled' } }>,
	reply: FastifyReply
	) => {
	const { currentUserId, requesterId, status } = request.body;

	if (!currentUserId || !requesterId || !status) {
		return reply.status(400).send({ error: 'Faltan campos obligatorios' });
	}

	try {
		const id = await friendshipsService.respondToFriendRequest(currentUserId, requesterId, status);
		reply.status(200).send({ updatedFriendshipId: id });
	} catch (err: any) {
		reply.status(400).send({ error: err.message });
	}
};

//  3. Bloquear a un usuario
export const blockUserController = async (
	request: FastifyRequest<{ Body: { currentUserId: number; otherUserId: number } }>,
	reply: FastifyReply
	) => {
	const { currentUserId, otherUserId } = request.body;

	if (!currentUserId || !otherUserId) {
		return reply.status(400).send({ error: 'Faltan campos obligatorios' });
	}

	try {
		const id = await friendshipsService.blockUser(currentUserId, otherUserId);
		reply.status(200).send({ blockedRelationId: id });
	} catch (err: any) {
		reply.status(400).send({ error: err.message });
	}
};

//  4. Obtener amigos de un usuario
export const getFriendsController = async (
	request: FastifyRequest<{ Params: { userId: string } }>,
	reply: FastifyReply
	) => {
	const userId = request.params.userId;
	if (isNaN(userId)) {
		return reply.status(400).send({ error: 'userId inválido' });
	}

	try {
		const friends = await friendshipsService.getFriends(userId);
		reply.status(200).send({ friends });
	} catch (err: any) {
		reply.status(500).send({ error: err.message });
	}
};

//  5. Eliminar toda la data de amistades de un usuario (uso interno o admin)
export const deleteAllFriendshipDataController = async (
	request: FastifyRequest<{ Params: { userId: string } }>,
	reply: FastifyReply
	) => {
	const userId = request.params.userId;
	if (isNaN(userId)) {
		return reply.status(400).send({ error: 'userId inválido' });
	}

	try {
		await friendshipsService.deleteUserFriendshipData(userId);
		reply.status(204).send(); // No content
	} catch (err: any) {
		reply.status(500).send({ error: err.message });
	}
};
