import { Messages } from "../../backend/models/messages.model";

export interface IMessagesRepository 
{
	sendMessages(senderId : string, receiverId : string, content : string): Promise<number>;
	getMessagesBetweenUsers
	(
		senderId: string,
		receiverId: string,
		limit,
		offset
	) : Promise<Pick<Messages, 'id' | 'sender_id' | 'receiver_id' | 'content' | 'sent_at' | 'is_read'>[]>;
	markMessagesAsRead(senderId : string, receiverId : string): Promise<{ read: boolean }>
}