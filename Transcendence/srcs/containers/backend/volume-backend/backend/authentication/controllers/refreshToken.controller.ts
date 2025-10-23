import { FastifyRequest, FastifyReply } from 'fastify';
import {signToken, verifyRefreshToken } from '../../../utils/jwt';

export const refreshTokenController = async (request: FastifyRequest, reply: FastifyReply) => {
  const refreshToken = request.cookies.refresh_token;

  if (!refreshToken)
    return reply.status(401).send({ error: 'No refresh token' });

  try {
    const payload = verifyRefreshToken(refreshToken);
    
    // Opcional: aquí puedes verificar en tu DB que el usuario sigue activo
    const newAccessToken = signToken({ id: payload.id, nickname: payload.nickname }, '15m');

    reply.cookie('access_token', newAccessToken, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: true,
      path: '/',
      maxAge: 60 * 15,
    });

    reply.send({ message: 'Access token refreshed' });

  } catch (err) {
    reply.status(403).send({ error: 'Invalid refresh token' });
  }
};
