export interface Stadistics
{
	id: number;
	user_id: string;
	elo?: number;
	exp?: number;
	level?: number;
	win_royale?: number;
	win?: number;
	lost?: number;
	max_time?: string;         // DATE se representa como string en ISO format
	max_score?: number;
}
