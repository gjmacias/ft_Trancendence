import { FastifyReply } from 'fastify';

import { sign2FAToken} from '../../../utils/jwt';
import { UsersRepository } from '../../../database/repositories-sqlite/users.repository';
import { generateSecretAndURL, verifiy2FAtoken } from '../../../utils/2FA';


export async function set2FACookiesService(reply: FastifyReply, user) {
	if (!user) return reply.status(400).send('Not user found');

	const repository = new UsersRepository();

	let secret = await repository.showSecret2FA(user.id);

	let url_2FA = null;

	if (!secret) {
		// Generar secreto y guardarlo
		const {secret, url} = await generateSecretAndURL(user.id);

		repository.updateSecret2FA(user.id, secret);
		url_2FA = url;
	}

	const mid2FAToken = sign2FAToken({ id: user.id, qr2fa: url_2FA }, '15m');

	const redirectUrl = '/verify';

	reply
		.cookie('mid_2fa_token', mid2FAToken, {
			httpOnly: true,
			sameSite: 'Strict',
			secure: true,
			path: '/',
			maxAge: 60 * 5,
		})
		.redirect(redirectUrl); // Redirigimos al frontend a la página de 2FA
}

export async function verify2FAService( id: string, token:string) : Promise<boolean>
{
	const repository = new UsersRepository();
	const secret = await repository.showSecret2FA(id); // ← Debe devolver base32

	if (!secret) return false;

	const verified = await verifiy2FAtoken(secret, token);

	return verified;
}
