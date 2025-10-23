import { FastifyPluginAsync } from 'fastify';
import {
  sendFriendRequestController,
  respondToFriendRequestController,
  blockUserController,
  getFriendsController,
  deleteAllFriendshipDataController
} from '../controllers/friendships.controller';

const routes: FastifyPluginAsync = async (fastify) => {
  // Crear una solicitud de amistad
  fastify.post('/', sendFriendRequestController);

  // Aceptar o cancelar solicitud
  fastify.post('/:userId/respond/:requesterId', respondToFriendRequestController);

  // Bloquear a un usuario
  fastify.post('/:userId/block/:otherUserId', blockUserController);

  // Obtener todos los amigos de un usuario
  fastify.get('/list/:userId', getFriendsController);

  // Eliminar todos los datos de amistad relacionados a un usuario
  fastify.delete('/delete/:userId', deleteAllFriendshipDataController);
};

export default routes;
