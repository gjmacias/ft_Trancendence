export interface Messages
{
	id?: number;
	sender_id: string;         // references users(id)
	receiver_id: string;       // references users(id)
	content: string;
	sent_at?: string;          // stored as ISO timestamp
	is_read?: boolean;         // 0 (false) or 1 (true)
}
