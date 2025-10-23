import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt'
import { OAuth2Client } from 'google-auth-library';

import { IUsersRepository } from "../../IRepositories/IUsersRepository";
import { StadisticsRepository } from "../../../database/repositories-sqlite/stadistics.repository";
import { Users } from "../../models/users.model";
import { CLIENT_ID_GOOGLE, CLIENT_SECRET_GOOGLE, REDIRECT_URI_GOOGLE } from '../../../config';
import { AuthValidations } from '../validations/user.validation'

const client = new OAuth2Client(CLIENT_ID_GOOGLE);

export class AuthService 
{
	private repository: IUsersRepository;

	constructor(repository: IUsersRepository) 
	{
		this.repository = repository;
	}
	async createUser(nickname : string, password : string, email : string): Promise<{id: string}>
	{
				// 1. Validaciones Generales
		AuthValidations.nickname(nickname);
		AuthValidations.password(password);
		AuthValidations.email(email);

				// 2. Comprobar usuario
		var user = await this.repository.selectUserByNickname(nickname);
		if (user) 
		{
			throw new Error(`Este usuario ya existe: ${nickname}`);
		}
		user = await this.repository.selectUserByEmail(email);
		if (user) 
		{
			throw new Error(`Este email ya existe: ${email}`);
		}

				// 3. Hashear Contraseña
		const hashedPassword = bcrypt.hashSync(password, 10);
		const newUser: Users = {
			nickname: nickname,
			password: hashedPassword,
			email: email
		};
		const createdUser = await this.initUserDataService(newUser);
		if (createdUser)
		{
			return{id: createdUser}
		}
		else
			throw new Error('No se ha creado el usuario');
	}

	async login(nickname : string, password : string): Promise<Pick<Users, "id" | "nickname" | "route_photo" |  "active_2FA"> | null>
	{
		AuthValidations.nickname(nickname);
		AuthValidations.password(password);
		
		var isValid = true;
		var user = await this.repository.selectUserByNickname(nickname);
		if (!user || user.id === undefined) 
			isValid = false;
		else
		{
			isValid = bcrypt.compareSync(password, await this.repository.showPassword(user.id));
		}
		
		if (!isValid)
			throw new Error('Nickname or password is invalid')
		return user;
	} 

	async googleOAuthService(code: string)
	{
		const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				code,
				client_id: CLIENT_ID_GOOGLE,
				client_secret: CLIENT_SECRET_GOOGLE,
				redirect_uri: REDIRECT_URI_GOOGLE,
				grant_type: 'authorization_code',
			}),
		});

		const tokenData = await tokenRes.json();
		const idToken = tokenData.id_token;
		if (!idToken) {
			throw new Error('No ID token received from Google OAuth');
		}

		const ticket = await client.verifyIdToken({
			idToken,
			audience: CLIENT_ID_GOOGLE,
		});
		const payload = ticket.getPayload();

		if (!payload) throw new Error('Token inválido');

		const googleId = payload.sub;
		const email = payload.email;

		// Busca en tu base de datos
		let user = await this.repository.selectUserByGoogleID(googleId);

		if (!user) 
			{
			const newUser: Users = {
				nickname: email,
				id_google: googleId,
				email: email
			};
			await this.initUserDataService(newUser);
			user = await this.repository.selectUserByGoogleID(googleId);
			return user;
		}
		return user;
	}
	
	async OAuth42Service(access_token: string) 
	{
		const userRes = await fetch('https://api.intra.42.fr/v2/me', {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		if (!userRes.ok)
		{
			throw new Error('Failed to fetch user info from 42');
		}

		const userData = await userRes.json();

		const id42 = userData.id;
		const email = userData.email;

		// Busca en tu base de datos
		let user = await this.repository.selectUserBy42ID(id42);

		if (!user) 
			{
			const newUser: Users = {
				nickname: email,
				id_42: id42,
				email: email
			};
			await this.initUserDataService(newUser);
			user = await this.repository.selectUserBy42ID(id42);
			return user;
		}
		return user;
	}

	async returnUserService(id: string) 
	{
		var user = await this.repository.selectUserByID(id);
		if (user)
		{
			return user;
		}
		return null;
	}
	
	async watchNicknameService(nickname: string) 
	{
		var user = await this.repository.selectUserByNickname(nickname);
		if (user)
		{
			throw new Error(`Este usuario ya existe: ${nickname}`);
		}
	}

	async watchEmailService(email: string) 
	{
		var user = await this.repository.selectUserByEmail(email);
		if (user) 
		{
			throw new Error(`Este usuario ya existe: ${email}`);
		}
	}

	async initUserDataService(newUser: Users) : Promise <string>
	{
		const createdUserID = await this.repository.createUser(newUser);

		const createStadistics = new StadisticsRepository();
		await createStadistics.createStadistics(createdUserID);

		return createdUserID;
	}
}
