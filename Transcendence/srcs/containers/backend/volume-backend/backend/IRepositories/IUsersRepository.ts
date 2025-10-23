import { Users } from "../../backend/models/users.model";

export interface IUsersRepository 
{
	createUser(user: Users): Promise<string>;
	selectUserByNickname(nickname: string): Promise<Pick<Users, 'id' | 'nickname' | 'route_photo' |  'active_2FA'> | null>;
	selectUserByEmail(email: string): Promise<Pick<Users, 'id' | 'nickname' | 'route_photo' |  'active_2FA'> | null> 
	selectUserByID(id: string): Promise<Pick<Users, 'id' | 'nickname' | 'route_photo' |  'active_2FA'> | null> ;
	selectUserByGoogleID(id_google: string): Promise<Pick<Users, 'id' | 'nickname' | 'route_photo' |  'active_2FA'> | null>;
	selectUserBy42ID(id_42: string): Promise<Pick<Users, 'id' | 'nickname' | 'route_photo' |  'active_2FA'> | null>;
	selectEmailByID(id: string) : Promise<string | null>

	updatePassword(userId: string, password: string) : Promise<boolean>;
	updateNickname(userId: string, nickname: string) : Promise<boolean>;
	updatePhoto(userId: string, photo: string) : Promise<boolean>;
	updateIsActive(userId: string, is_active: boolean) : Promise<boolean>;
	updateSecret2FA(userId: string, secret_2FA: string) : Promise<boolean>;
	updateActive2FA(userId: string, active_2FA: boolean) : Promise<boolean>;
	updatePrivate(userId: string, privateCount: boolean) : Promise<boolean>;

	//WARNING
	showPassword(id: string): Promise<string>;
	showSecret2FA(id: string): Promise<string | null>;
	deleteSecret2FA(id: string): Promise<void>;
	deleteUser(id: string): Promise<void>;
}