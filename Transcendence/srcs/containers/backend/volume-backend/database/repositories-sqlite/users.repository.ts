import { IUsersRepository } from "../../backend/IRepositories/IUsersRepository";
import db from '../connection.sqlite';
import { Users } from '../../backend/models/users.model';
import { v4 as uuidv4 } from "uuid";

export class UsersRepository implements IUsersRepository
{
	createUser(user: Partial<Users>): Promise<string>
	{
		const sql = `
            INSERT INTO users 
            (id, password, nickname, email, route_photo, id_google, id_42, created_at, updated_at, is_active, secret_2FA, active_2FA, privateCount) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const now = new Date().toISOString();
        const generatedId = user.id ?? uuidv4();

        const params = [
            generatedId,
            user.password ?? null,
            user.nickname,
            user.email ?? null,
            user.route_photo ?? null,
            user.id_google ?? null,
            user.id_42 ?? null,
            now,
            now,
            user.is_active ?? true,
            user.secret_2FA ?? null,
            user.active_2FA ?? false,
            user.privateCount ?? false,
        ];

		return new Promise((resolve, reject) => {
			db.run(sql, params, function (err) {
				if (err)
					reject(err);
				else
					resolve(generatedId);
			});
		});
	};


	selectUserByID(id: string) { return this.selectByField('id', id); }
	selectUserByNickname(nickname: string) { return this.selectByField('nickname', nickname); }
	selectUserByEmail(email: string) { return this.selectByField('email', email); }
	selectUserByGoogleID(id_google: string) { return this.selectByField('id_google', id_google); }
	selectUserBy42ID(id_42: string) { return this.selectByField('id_42', id_42); }

	selectEmailByID(id: string) : Promise<string | null>
	{
		const sql = `SELECT email FROM users WHERE id = ?`;

		return new Promise((resolve, reject) =>
		{
			db.get(sql, [id], (err, row) =>
			{
				if (err) reject(err);
				else resolve(row?.email ?? null);
			});
		});
	}

	updatePassword(userId: string, password: string) {
		return this.updateField('password', userId, password);
	}

	updateNickname(userId: string, nickname: string) {
		return this.updateField('nickname', userId, nickname);
	}

	updatePhoto(userId: string, photo: string) {
		return this.updateField('route_photo', userId, photo);
	}

	updateIsActive(userId: string, is_active: boolean) {
		return this.updateField('is_active', userId, is_active);
	}
	updateSecret2FA(userId: string, secret_2FA: string) {
		return this.updateField('secret_2FA', userId, secret_2FA);
	}
	updateActive2FA(userId: string, active_2FA: boolean) {
		return this.updateField('active_2FA', userId, active_2FA);
	}
	updatePrivate(userId: string, privateCount: boolean) {
		return this.updateField('privateCount', userId, privateCount);
	}

	/*
	----------------------------------	WARNING	----------------------------------
	*/

	showPassword(id: string): Promise<string>
	{
		const sql = 'SELECT password FROM users WHERE id = ?';

		return new Promise((resolve, reject) => {
			db.get(sql, id, (err, row) => {
				if (err)
					reject(err);
				else
					resolve(row.password);
			});
		});
	}
	showSecret2FA(id: string): Promise<string | null>
	{
		const sql = 'SELECT secret_2FA FROM users WHERE id = ?';

		return new Promise((resolve, reject) => {
			db.get(sql, id, (err, row) => {
				if (err)
					reject(err);
				else
					resolve(row.secret_2FA);
			});
		});
	}

	deleteSecret2FA(id: string): Promise<void> 
	{
		return new Promise((resolve, reject) => {
			db.run(`UPDATE users
					SET 
					secret_2FA = NULL
					WHERE id = ?`, [id], function (err) {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
	};

	deleteUser(id: string): Promise<void> 
	{
		return new Promise((resolve, reject) => {
			db.run(`UPDATE users
					SET 
					password = NULL,
					nickname = 'deleted_user',
					email = NULL,
					route_photo = NULL,
					id_google = NULL,
					id_42 = NULL,
					is_active = 0,
					secret_2FA = NULL,
					active_2FA = 0,
					privateCount = 1
					WHERE id = ?`, [id], function (err) 
					{
						if (err)
							reject(err);
						else
							resolve();
					});
		});
	};

	/*
	----------------------------------	Functions	----------------------------------
	*/

	private updateField(field: string, userId: string, value: any): Promise<boolean>
	{
		return new Promise((resolve, reject) => 
		{
			const sql = `
				UPDATE users 
				SET ${field} = ?, updated_at = CURRENT_TIMESTAMP 
				WHERE id = ?`;
			const params = [value, userId];

			db.run(sql, params, function (err) 
			{
				if (err) reject(err);
				else resolve(this.changes > 0);
			});
		});
	}

	private selectByField(field: string, value: string | number):
		Promise<Pick<Users, 'id' | 'nickname' | 'route_photo' |  'active_2FA' | 'email'> | null>
	{
		const sql = `SELECT id, nickname, route_photo , active_2FA, email FROM users WHERE ${field} = ?`;

		return new Promise((resolve, reject) =>
		{
			db.get(sql, [value], (err, row) =>
			{
				if (err) reject(err);
				else resolve(row ?? null);
			});
		});
	}
}
