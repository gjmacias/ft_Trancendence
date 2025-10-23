import { IFriendshipsRepository } from "../../backend/IRepositories/IFriendshipsRepository";
import db from '../connection.sqlite';
import { Friendships } from "../../backend/models/friendships.model";

export class FriendshipsRepository implements IFriendshipsRepository
{
	createFriendship(requester_id: string, addressee_id: string ): Promise<number>
	{
		const sql = `
			INSERT INTO friendships (requester_id, addressee_id, status)
			VALUES (?, ?, 'pending')
		`;

		return new Promise((resolve, reject) => {
			db.run(sql, [requester_id, addressee_id], function (this: { lastID: number }, err) {
			if (err) 
				reject(err);
			else 
				resolve(this.lastID);
			});
		});
	};

	respondToFriendRequest (
		currentUserId: string,
		requesterId: string,
		status: 'accepted' | 'cancelled'
		) : Promise<number>
	{
		const validStatuses = ['accepted', 'cancelled'];

		if (!validStatuses.includes(status)) {
			return Promise.reject(new Error('Estado inválido.'));
		}

		const sql = `
			UPDATE friendships
			SET status = ?, updated_at = CURRENT_TIMESTAMP
			WHERE requester_id = ? AND addressee_id = ?
		`;

		return new Promise((resolve, reject) =>
		{
			db.run(sql, [status, requesterId, currentUserId], function (this: { changes: number }, err) {
			if (err) 
				return reject(err);
			if (this.changes === 0) 
				return reject(new Error('No se encontró la solicitud o ya fue respondida.'));
			resolve(this.changes);
			});
		});
	};

	blockUser(
		currentUserId: string,
		otherUserId: string
		) : Promise<number>
	{
		const sql = `
			UPDATE friendships
			SET 
			requester_blocked = CASE WHEN requester_id = ? THEN 1 ELSE requester_blocked END,
			addressee_blocked = CASE WHEN addressee_id = ? THEN 1 ELSE addressee_blocked END,
			updated_at = CURRENT_TIMESTAMP
			WHERE (requester_id = ? AND addressee_id = ?)
			OR (requester_id = ? AND addressee_id = ?)
		`;

		return new Promise((resolve, reject) =>
		{
			db.run(sql, [
			currentUserId,
			currentUserId,
			currentUserId, otherUserId,
			otherUserId, currentUserId
			], function (this: { changes: number }, err) {
			if (err) 
				return reject(err);
			if (this.changes === 0)
				return reject(new Error('No existe relación entre los usuarios.'));
			resolve(this.changes);
			});
		});
	};

	getFriendsByUserId(userId: string): Promise<number[]>
	{
		const sql = `
			SELECT 
			CASE 
				WHEN requester_id = ? THEN addressee_id 
				ELSE requester_id 
			END as friend_id
			FROM friendships
			WHERE 
			(requester_id = ? OR addressee_id = ?)
			AND status = 'accepted'
			AND requester_blocked = 0
			AND addressee_blocked = 0
		`;

		return new Promise((resolve, reject) =>
		{
			db.all(sql, [userId, userId, userId], (err, rows) => {
			if (err)
				return reject(err);
			const friends = rows.map(row => row.friend_id);
			resolve(friends);
			});
		});
	};

	deleteAllUserData(userId: string): Promise<void>
	{
		const sql = `
			DELETE FROM friendships 
			WHERE requester_id = ? OR addressee_id = ?
		`;

		return new Promise((resolve, reject) =>
		{
			db.run(sql, [userId, userId], function (err) {
			if (err) return reject(err);
			resolve();
			});
		});
	};
}