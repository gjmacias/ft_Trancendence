import { verifyToken, verify2FAToken, verifyRefreshToken, signToken } from '../utils/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
	const token = request.cookies?.access_token;
	const refresh_token = request.cookies?.refresh_token;

	if (!token)
	{
		if (refresh_token)
		{
		refresh_tokenJWT(refresh_token, request, reply);
		return;
		}
		(request as any).user = null;
		return;
	}

	try
	{
		const decoded = verifyToken(token);

		// Validación mínima para asegurar integridad del token
		if (typeof decoded.id === 'string' && typeof decoded.nickname === 'string') 
		{
			request.user = { id: decoded.id, nickname: decoded.nickname };
		} 
		else 
		{
			request.user = null;
		}
	} catch (err)
	{
		if (refresh_token)
		{
		refresh_tokenJWT(refresh_token, request, reply);
		return;
		}
		(request as any).user = null;
	}
}

export async function verify2FA(request: FastifyRequest, reply: FastifyReply) {
	const token = request.cookies?.mid_2fa_token;

	if (!token)
	{
		request.mid2FA = null;
		return;
	}
	try
	{
		const decoded = verify2FAToken(token);

		// Validación mínima para asegurar integridad del token
		if (typeof decoded.id === 'string') 
		{
			request.mid2FA = { id: decoded.id, qr2fa: decoded.qr2fa };
		} 
		else 
		{
			request.mid2FA = null;
		}
	} catch (err)
	{
			(request as any).mid2FA = null;
	}
}


function refresh_tokenJWT(refresh_token, request: FastifyRequest, reply: FastifyReply)
{
  try {
    const payload = verifyRefreshToken(refresh_token)

    const newAccessToken = signToken({ id: payload.id, nickname: payload.nickname }, '15m');

    reply.cookie('access_token', newAccessToken, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: true,
      path: '/',
      maxAge: 60 * 15,
    });

    (request as any).user = { id: payload.id, nickname: payload.nickname };
  } catch (err) {
    (request as any).user = null;
  }
}
