import { FastifyPluginAsync } from 'fastify';
import { 
	logInController,
	createUserController,
	logOutController,
	statusController,
	googleOAuthController,
	googleOAuthCallbackController,
	OAuth42Controller,
	OAuth42CallbackController,
	watchNicknameController,
	watchEmailController,
	is2FAActiveController,
	Callback2FAController
 } from '../controllers/auth.controller';

const routes: FastifyPluginAsync = async (fastify) => 
	{
	fastify.post('/login', logInController);
	fastify.post('/register', createUserController);
	fastify.post('/logout', logOutController);

	fastify.post('/status', statusController);

	fastify.get('/google', googleOAuthController);
	fastify.get('/42', OAuth42Controller);

	fastify.get('/google/callback', googleOAuthCallbackController);
	fastify.get('/42/callback', OAuth42CallbackController);
	fastify.post('/2FA/callback', Callback2FAController);

	fastify.get('/2fa-enabled', is2FAActiveController);
	fastify.get('/nickname/:nickname', watchNicknameController);
	fastify.get('/email/:email', watchEmailController);
};

export default routes;