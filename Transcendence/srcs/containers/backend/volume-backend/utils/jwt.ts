import jwt from 'jsonwebtoken';
import { JWT_2FA_SECRET, JWT_SECRET, REFRESH_JWT_SECRET } from '../config';

export function signToken(payload, expiresIn = '15m') {
	return jwt.sign(payload, JWT_SECRET, { expiresIn });
}
export function signRefreshToken(payload, expiresIn = '7d') {
	return jwt.sign(payload, REFRESH_JWT_SECRET, { expiresIn });
}

export function sign2FAToken(payload, expiresIn = '15m') {
	return jwt.sign(payload, JWT_2FA_SECRET, { expiresIn });
}

export function verifyToken(token: string): any {
	return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string): any {
	return jwt.verify(token, REFRESH_JWT_SECRET);
}

export function verify2FAToken(token: string): any {
	return jwt.verify(token, JWT_2FA_SECRET);
}