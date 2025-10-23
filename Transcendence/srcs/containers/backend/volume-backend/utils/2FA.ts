import speakeasy from 'speakeasy';
import { NAME } from '../config';
import { UsersRepository } from '../database/repositories-sqlite/users.repository';

export async function generateSecretAndURL(id: number)
{
	const repository = new UsersRepository()
	const email = await repository.selectEmailByID(id);
	const generated = speakeasy.generateSecret({
		name: `${NAME}:${email}`,
		issuer: `${NAME}`,
	});

	return{ secret: generated.base32, url: generated.otpauth_url};
}

export function verifiy2FAtoken(secret : string , token : string)
{
	return speakeasy.totp.verify({
		secret: secret,
		encoding: 'base32',
		token: token,
		window: 1, // tolerancia de 30s antes/después
	});
}