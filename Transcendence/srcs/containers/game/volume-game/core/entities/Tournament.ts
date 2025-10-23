import { GameConfiguration } from "./GameConfiguration";
import { Player } from "./Player";
import { v4 as uuidv4 } from 'uuid';

export class Tournament
{
	id: string; // ID del match o estado
	timestamp: number; // UNIX timestamp o delta para sincronización
	allPlayers: Player[];
	nextRoundPlayers: Player[];
	status: "waiting" | "running" | "paused" | "ended";
	winner: string; // Jugador ganador, si aplica
	configuration: GameConfiguration;

	constructor(mode : string)
	{
		this.id = uuidv4();
		this.timestamp = Date.now();
		this.status = "paused";
		this.winner = "";
		this.configuration = new GameConfiguration(mode, "1v1");
	}
}