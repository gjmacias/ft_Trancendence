import { FastifyReply } from 'fastify';
import { signToken, signRefreshToken } from '../../../utils/jwt';

export function setAuthCookiesService(reply: FastifyReply, user: any) {
	const token = signToken({ id: user.id, nickname: user.nickname }, '15m');
	const refreshToken = signRefreshToken({ id: user.id, nickname: user.nickname }, '7d');

	reply
		.cookie('access_token', token, {
			httpOnly: true,
			sameSite: 'Strict',
			secure: true,
			path: '/',
			maxAge: 60 * 15, // 15 minutos
		})
		.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: 'Strict',
			secure: true,
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 días
		});
}
