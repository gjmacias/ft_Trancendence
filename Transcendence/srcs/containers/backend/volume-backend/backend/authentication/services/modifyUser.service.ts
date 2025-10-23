import { UsersRepository } from '../../../database/repositories-sqlite/users.repository';
import bcrypt from 'bcrypt'
import {AuthValidations} from '../validations/user.validation'

export class UserService
{
	private repository = new UsersRepository();

	async updatePassword(userId: string, oldpassword: string, newpassword: string)
	{
		AuthValidations.password(newpassword);

		// const isValid = bcrypt.compareSync(oldpassword, await this.repository.showPassword(userId));

		// if (isValid)
		// {
			const hashedPassword = bcrypt.hashSync(newpassword, 10);
			return this.repository.updatePassword(userId, hashedPassword);
		// }
		// throw new Error("Cannot change password");
	};

	async updateNickname(userId: string, nickname: string)
	{
		AuthValidations.nickname(nickname);
		var user = await this.repository.selectUserByNickname(nickname);
		if (user) 
		{
			throw new Error(`Este usuario ya existe: ${nickname}`);
		}
		return this.repository.updateNickname(userId, nickname);
	}

	updatePhoto(userId: string, path_photo: string)
	{
		return this.repository.updatePhoto(userId, path_photo);
	}

	updateIsActive(userId: string, is_active: boolean)
	{
		return this.repository.updateIsActive(userId, is_active);
	}

	updateActive2FA(userId: string, is_active2FA: boolean)
	{
		return this.repository.updateActive2FA(userId, is_active2FA);
	}
	updatePrivateCount(userId: string, privateCount: boolean)
	{
		return this.repository.updatePrivate(userId, privateCount);
	}

	deleteUser2FASecret(userId: string)
	{
		return this.repository.deleteSecret2FA(userId);
	}	
	
	deleteUserInformation(userId: string)
	{
		return this.repository.deleteUser(userId);
	}

	
	async getUserInformation(userId: string)
	{
		const user = await this.repository.selectUserByID(userId);
		if (user)
		{
			const email = user.email;
			const nickname = user.nickname;
			return { nickname, email };
		}
	}

	async getRutePhoto(userId: string)
	{
		const user = await this.repository.selectUserByID(userId);

		if (user)
			return user.route_photo
	}
}
