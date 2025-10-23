import { FastifyPluginAsync } from 'fastify';
import { UserController } from '../controllers/modifyUser.controller';
import { upload } from '../../../utils/savePhotos';

const routes: FastifyPluginAsync = async (fastify) => 
{
	const controller = new UserController();
	fastify.post('/password', controller.updatePassword);
	fastify.post('/nickname', controller.updateNickname);
	fastify.post('/photo', { preHandler: upload.single('photo') }, controller.updatePhoto);
	fastify.post('/isactive', controller.updateIsActive);
	fastify.post('/active2FA', controller.updateActive2FA);
	fastify.post('/privateCount', controller.updatePrivateCount);
	fastify.post('/delete-2FA-Secret', controller.deleteUser2FASecret);
	fastify.post('/delete-your-information', controller.deleteUserInformation);
	fastify.get('/get-your-information', controller.getUserInformation);
	fastify.get('/get-nickname', controller.getNickname);
	fastify.get('/get-photo', controller.getPhoto);
};

export default routes;