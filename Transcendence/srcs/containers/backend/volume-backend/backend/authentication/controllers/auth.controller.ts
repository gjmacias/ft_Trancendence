import { FastifyRequest, FastifyReply } from 'fastify';

import { AuthService } from '../services/auth.service';
import { UsersRepository } from '../../../database/repositories-sqlite/users.repository';
import { setAuthCookiesService } from '../services/setAuthCookies.service';
import { set2FACookiesService, verify2FAService } from '../services/set2FA.service';
import { CLIENT_ID_42, CLIENT_SECRET_42, REDIRECT_URI_42, CLIENT_ID_GOOGLE, REDIRECT_URI_GOOGLE } from '../../../config';

const authService = new AuthService(new UsersRepository)

export const createUserController = async (
	request: FastifyRequest<{ Body: { nickname : string; password : string; email : string } }>,
	reply: FastifyReply
	) => {
	try 
	{
		const { nickname, password, email } = request.body;

		if (!nickname || !password || !email) 
		{
			return reply.status(400).send({ error: 'Faltan campos obligatorios'});
		}

		const id = await authService.createUser(nickname, password, email);
		reply.status(201).send(id);
	} catch (err: any) {
		reply.status(500).send({ error: err.message });
	}
};

export const logInController = async (
	request: FastifyRequest<{ Body: { nickname : string; password : string } }>,
	reply: FastifyReply
	) => {
	try 
	{
		const { nickname, password } = request.body;

		if (!nickname || !password) 
		{
			return reply.status(400).send({ error: 'Faltan campos obligatorios'});
		}

		const user = await authService.login(nickname, password);
		if (!user) return reply.status(401).send({ error: 'Credenciales inválidas' });
		if (user.active_2FA)
			return set2FACookiesService(reply, user);
		else
			return setAuthCookiesService(reply, user);
	} catch (err: any) {
		reply.status(400).send({ error: err.message });
	}
};

export const logOutController = async (
	request: FastifyRequest,
	reply: FastifyReply
	) => 
{
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
	})
	.clearCookie('mid_2fa_token', {
		httpOnly: true,
		sameSite: 'Strict',
		secure: true,
		path: '/',
	})
	.send('Successfully logged out');
};

export const statusController = async ( request: FastifyRequest, reply: FastifyReply ) =>
{
	const { user, mid2FA } = request;
	if (mid2FA) 
	{ 
		const { qr2fa } = mid2FA;
		if (qr2fa) 
		{ 
			return reply.status(210)
			.send({ message: '2FA required with QR code', qr2fa });
		} else {
			return reply.status(211)
			.send({ message: '2FA required without QR code', qr2fa: null });
		}
	}
	if (user) 
	{
		return reply.status(200).send({ message: 'User is logged in', user });
	}
	return reply.status(212).send({ error: 'Access not authorized' });
};

export const googleOAuthController = async (request, reply) => {
	const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
		client_id: CLIENT_ID_GOOGLE,
		redirect_uri: REDIRECT_URI_GOOGLE,
		response_type: "code",
		scope: "openid profile email",
		access_type: "offline",
		prompt: "consent"
	}).toString();

	return reply.redirect(googleAuthUrl);
};

export const googleOAuthCallbackController = async (request, reply) => {
	try 
	{
		const { code } = request.query;
		if (!code)
			return reply.status(400).send({ error: 'Falta el code' });

		const user = await authService.googleOAuthService(code);
		if (!user) return reply.status(401).send({ error: 'Credenciales inválidas' });

		if (user?.active_2FA)
			return set2FACookiesService(reply, user);
		else
			setAuthCookiesService(reply, user);
		reply.redirect("/");	
	} catch (err) {
		console.error(err);
		reply.status(401).send({ error: 'Token inválido' });
	}
};

/* Nota para mañana:
- En la página de 42, me da el error 'Invalid redirect_uri' cuando intento hacer el OAuth.
Hablar con Galo para ver si los datos del repositorio están actualizados.
*/
export const OAuth42Controller = async (request, reply) =>
{
	const Auth42Url = "https://api.intra.42.fr/oauth/authorize?" + new URLSearchParams({
		client_id: CLIENT_ID_42,
		redirect_uri: REDIRECT_URI_42,
		response_type: "code",
		scope: "public"
	}).toString();

	return reply.redirect(Auth42Url);
};

export const OAuth42CallbackController = async (request, reply) => {
	const { code } = request.query;
	if (!code )
		return reply.status(400).send({ error: 'No code provided' });
	try 
	{
		const body = new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: CLIENT_ID_42,
			client_secret: CLIENT_SECRET_42,
			code,
			redirect_uri: REDIRECT_URI_42,
		});
		const tokenRes = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body,
		});
		if (!tokenRes.ok)
		{
			const error = await tokenRes.json();
			return reply.status(401).send({ error: 'Token exchange failed', details: error });
		}

		const { access_token } = await tokenRes.json();
		if (!access_token) return reply.status(401).send({ error: 'Credenciales inválidas' });

		const user = await authService.OAuth42Service(access_token);
		if (user?.active_2FA)
			return set2FACookiesService(reply, user);
		else
			setAuthCookiesService(reply, user);	
		reply.redirect("/");	
	} catch (err) {
		reply.status(401).send({ error: 'Token inválido' });
	}
};

export const Callback2FAController = async (req: FastifyRequest, reply: FastifyReply) => {
	const mid2FA = req.mid2FA;
	if (!mid2FA)
		return reply.status(403).send({ error: 'User not authorized' });
	try
	{
		const { code } = req.body as { code: string };
		const success = await verify2FAService(mid2FA.id, code);
		if (success)
		{
			const user = await authService.returnUserService(mid2FA.id);
			setAuthCookiesService(reply, user);
			reply.clearCookie('mid_2fa_token', {
			httpOnly: true,
			sameSite: 'Strict',
			secure: true,
			path: '/',
			});
			reply.status(200).send(user);
		}
		else
			reply.status(401).send({ error: 'Código inválido' });
	}
	catch (err)
	{
		reply.status(500).send({ error: 'Internal Server Error', details: err });
	}
};


export const watchNicknameController = async (request, reply) => {
	try 
	{
		const { nickname } = request.params;

		if (!nickname) 
		{
			return reply.status(400).send({ error: 'Faltan campos obligatorios'});
		}
		await authService.watchNicknameService(nickname);
	} catch (err: any) {
		reply.status(400).send({ error: err.message });
	}
}


export const watchEmailController = async (request, reply) => {
	try 
	{
		const { email } = request.params;

		if (!email) 
		{
			return reply.status(400).send({ error: 'Faltan campos obligatorios'});
		}
		await authService.watchEmailService(email);
	} catch (err: any) {
		reply.status(400).send({ error: err.message });
	}
}

export const is2FAActiveController = async (request: FastifyRequest, reply: FastifyReply) => {
  const { user } = request;
  if (!user) {
    return reply.status(403).send({ error: 'Access not authorized' });
  }
  try {
    const userData = await authService.returnUserService(user.id);
    if (!userData) {
      return reply.status(404).send({ error: 'User not found' });
    }
    reply.status(200).send({ active_2FA: userData.active_2FA });
  } catch (err) {
    reply.status(500).send({ error: 'Internal Server Error', details: err });
  }
}
