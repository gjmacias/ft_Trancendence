export interface Friendships 
{
	id?: number;
	requester_id: string;
	addressee_id: string;
	status: 'pending' | 'accepted' | 'cancelled';
	requester_blocked?: boolean;
	addressee_blocked?: boolean;
	created_at?: string;
	updated_at?: string;
}
