export interface Match 
{
	id?: number;
	player1_id: string;
	player2_id: string;
	score1: number;
	score2: number;
	winner_id?: number;
	created_at?: string;
	duration?: string;
	mode?: string;
}