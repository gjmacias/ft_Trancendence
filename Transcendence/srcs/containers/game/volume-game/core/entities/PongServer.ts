import WebSocket from 'ws';

import { GameState } from "./GameState";
import { Tournament } from './Tournament';
import { Matchmaking } from './Matchmaking';

export interface PlayerSocket
{
	ws: WebSocket;
	playerId: string;
	gameId?: string;
	tournamentId?: string;
}
	
export class PongServer
{
	clients: Set<PlayerSocket>;
	games: Set<GameState>;
	tournaments: Set<Tournament>;
	matchmaking: Set<Matchmaking>;

	constructor() {
		this.clients = new Set<PlayerSocket>();
		this.games = new Set<GameState>();
		this.tournaments = new Set<Tournament>();
		this.matchmaking = new Set<Matchmaking>();
	}
}