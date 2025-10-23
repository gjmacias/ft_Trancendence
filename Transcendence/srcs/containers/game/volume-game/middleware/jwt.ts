import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';
import { JWT_SECRET, REFRESH_JWT_SECRET } from "../config";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply)
{
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
		const decoded = jwt.verify(token, JWT_SECRET);

		// Validación mínima para asegurar integridad del token
		if (typeof decoded.id === 'string' && typeof decoded.nickname === 'string') 
		{
			request.user = { id: decoded.id, nickname: decoded.nickname };
		} 
		else 
		{
			request.user = null;
		}
	} 
	catch (err) 
	{
    if (refresh_token)
    {
      refresh_tokenJWT(refresh_token, request, reply);
      return;
    }
		(request as any).user = null;
	}
}

function refresh_tokenJWT(refresh_token, request: FastifyRequest, reply: FastifyReply)
{
	try {
		const payload = jwt.verify(refresh_token, REFRESH_JWT_SECRET);

		const newAccessToken = jwt.sign({ id: payload.id, nickname: payload.nickname }, JWT_SECRET, { expiresIn: '15m' });

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
