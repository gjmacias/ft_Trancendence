export interface User
{
	id?: string;
	nickname: string;
	color?: string;
	elo?: number;
	ws?: WebSocket;
}