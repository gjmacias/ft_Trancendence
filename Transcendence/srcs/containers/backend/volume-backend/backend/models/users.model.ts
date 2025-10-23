export interface Users
{
	id?: string;
	password?: string;
	nickname: string;
	email?: string;
	route_photo?: string;
	id_google?: string;
	id_42?: string;
	created_at?: string;
	updated_at?: string;
	is_active?: boolean;
	secret_2FA?: string;
	active_2FA?: boolean;
	privateCount?: boolean;
}
