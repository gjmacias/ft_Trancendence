import { IMessagesRepository } from "../../backend/IRepositories/IMessagesRepository";
import db from '../connection.sqlite';
import { Messages } from '../../backend/models/messages.model';

export class MessagesRepository implements IMessagesRepository
{
	sendMessages(senderId : string, receiverId : string, content : string): Promise<number>
	{
		return new Promise((resolve, reject) => {
			const sql = `
				INSERT INTO messages (sender_id, receiver_id, content, sent_at)
				VALUES (?, ?, ?, CURRENT_TIMESTAMP)
			`;
			const now = new Date().toISOString();
			db.run(sql, [senderId, receiverId, content], function (err) {
				if (err) 
					reject(err);
				else 
					resolve(this.lastID);
			});
		});
	};

	getMessagesBetweenUsers
	(
		senderId: string,
		receiverId: string,
		limit = 100,
		offset = 0
	) : Promise<Pick<Messages, 'id' | 'sender_id' | 'receiver_id' | 'content' | 'sent_at' | 'is_read'>[]>
	{
		const sql = `
			SELECT id, sender_id, receiver_id, content, sent_at, is_read FROM messages
			WHERE (sender_id = ? AND receiver_id = ?)
				OR (sender_id = ? AND receiver_id = ?)
			ORDER BY sent_at DESC
			LIMIT ? OFFSET ?
		`;

		return new Promise((resolve, reject) => 
		{
			db.all(sql, [senderId, receiverId, receiverId, senderId, limit, offset], (err, rows) => {
				if (err) 
					reject(err);
				else 
					resolve(rows);
			});
		});
	};

	markMessagesAsRead(senderId : string, receiverId : string): Promise<{ read: boolean }>
	{
		const sql = `
				UPDATE messages 
				SET is_read = 1 
				WHERE (sender_id = ? AND receiver_id = ?)`;

		return new Promise((resolve, reject) =>
		{
			db.run(sql, [senderId, receiverId], function (err) {
				if (err) 
					reject(err);
				else 
					resolve({ read: true });
			});
		});
	};
}