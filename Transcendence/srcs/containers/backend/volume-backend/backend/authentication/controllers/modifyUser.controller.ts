import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/modifyUser.service';

export class UserController {
	private service = new UserService();

	updatePassword = async (req: FastifyRequest, reply: FastifyReply) => {
		const user = req.user;
		if (!user)
			return reply.status(403).send({ error: 'User not authorized' });

		try
		{
			const oldpassword = "";
			const { password } = req.body as { password: string };
			const success = await this.service.updatePassword(user.id, oldpassword, password);
			reply.code(success ? 200 : 404).send({ success });
		}
		catch (err)
		{
			reply.status(500).send({ error: 'Internal Server Error', details: err });
		}
	};

	updateNickname = async (req: FastifyRequest, reply: FastifyReply) => {
		const user = req.user;
		if (!user)
			return reply.status(403).send({ error: 'User not authorized' });

		try
		{
			const { nickname } = req.body as { nickname: string };
			const success = await this.service.updateNickname(user.id, nickname);
			reply.code(success ? 200 : 404).send({ success });
		}
		catch (err)
		{
			reply.status(500).send({ error: 'Internal Server Error', details: err });
		}
	};

	updatePhoto = async (req: FastifyRequest, reply: FastifyReply) => {
		const user = req.user;
		if (!user)
			return reply.status(403).send({ error: 'User not authorized' });
		
		const file = (req as any).file;
		if (!file) 
			return reply.status(400).send({ message: 'No se envió archivo' });
		try 
		{
			const photoPath = file.path;
			const success = await this.service.updatePhoto(user.id, photoPath);
			reply.code(success ? 200 : 404).send({ success });
		} 
		catch (err) {
			reply.status(500).send({ error: 'Internal Server Error', details: err });
		}
	};

	updateIsActive = async (req: FastifyRequest, reply: FastifyReply) => {
		const user = req.user;
		if (!user)
			return reply.status(403).send({ error: 'User not authorized' });
		try 
		{
			const { is_active } = req.body as { is_active: boolean };
			const success = await this.service.updateIsActive(user.id, is_active);
			reply.code(success ? 200 : 404).send({ success });
		} 
		catch (err) {
			reply.status(500).send({ error: 'Internal Server Error', details: err });
		}
	};

	updateActive2FA = async (req: FastifyRequest, reply: FastifyReply) => {
		const user = req.user;
		if (!user)
			return reply.status(403).send({ error: 'User not authorized' });
		try 
		{
			const { is_active } = req.body as { is_active: boolean };
			const success = await this.service.updateActive2FA(user.id, is_active);
			reply.code(success ? 200 : 404).send({ success });
		} 
		catch (err) {
			reply.status(500).send({ error: 'Internal Server Error', details: err });
		}
	};
	updatePrivateCount = async (req: FastifyRequest, reply: FastifyReply) => {
		const user = req.user;
		if (!user)
			return reply.status(403).send({ error: 'User not authorized' });
		try 
		{
			const { privateCount } = req.body as { privateCount: boolean };
			const success = await this.service.updatePrivateCount(user.id, privateCount);
			reply.code(success ? 200 : 404).send({ success });
		} 
		catch (err) {
			reply.status(500).send({ error: 'Internal Server Error', details: err });
		}
	};	
	deleteUser2FASecret = async (req: FastifyRequest, reply: FastifyReply) => {
		const user = req.user;
		if (!user)
			return reply.status(403).send({ error: 'User not authorized' });
		try 
		{
			await this.service.deleteUser2FASecret(user.id);
			reply.code(200).send({ success: true });
		} 
		catch (err) {
			reply.status(500).send({ error: 'Internal Server Error', details: err });
		}
	};


	deleteUserInformation = async (req: FastifyRequest, reply: FastifyReply) => {
		const user = req.user;
		console.log('Received request to delete user information');
		if (!user)
			return reply.status(403).send({ error: 'User not authorized' });
		try 
		{
			const { response } = req.body as { response: string };
			if (response == `I, ${user.nickname} want to delete my account`)
			{
				console.log(`User ${user.nickname} requested account deletion`);
				await this.service.deleteUserInformation(user.id);
				reply
					.clearCookie('access_token', {
							httpOnly: true,
							sameSite: 'Strict',
							secure: true,
							path: '/',
					})
					.clearCookie('refresh_token', {
							httpOnly: true,
							sameSite: 'Strict',
							secure: true,
							path: '/',
					}).send('Successfully logged out');
			}
			reply.code(200);
		} 
		catch (err) {
			console.error({details: err});
			reply.status(500).send({ error: 'Internal Server Error'});
		}
	};

	getUserInformation = async (req: FastifyRequest, reply: FastifyReply) => 
		{
			const user = req.user;
			if (!user)
				return reply.status(403).send({ error: 'User not authorized' });
			try
			{
				const { nickname, email } = await this.service.getUserInformation(user.id);
				reply.send(JSON.stringify({ nickname, email }));
			}
			catch (err)
			{
				reply.status(500).send({ error: 'Internal Server Error', details: err });
			}
		};
	
	

	getNickname = async (req: FastifyRequest, reply: FastifyReply) =>
	{
		const user = req.user;
		if (!user)
			return reply.status(403).send({ error: 'User not authorized' });

		try
		{
			reply.send(user.nickname);
		}
		catch (err)
		{
			reply.status(500).send({ error: 'Internal Server Error', details: err });
		}
	};

	getPhoto = async (req: FastifyRequest, reply: FastifyReply) =>
	{
		const user = req.user;
		if (!user)
			return reply.status(403).send({ error: 'User not authorized' });

		try
		{
			const route_photo = await this.service.getRutePhoto(user.id);
			reply.status(444).send({error: "no implementado aun"});
		}
		catch (err)
		{
			reply.status(500).send({ error: 'Internal Server Error', details: err });
		}
	};	
}
