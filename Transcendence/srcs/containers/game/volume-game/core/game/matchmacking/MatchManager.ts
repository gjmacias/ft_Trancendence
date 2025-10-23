import { Player } from "../../entities/Player"
import { User } from "../../entities/User";
import { MatchModeHandler } from "./MatchModes";

export type MatchRole = "1v1" | "teams" | "multi1v1" | "tournament" | "royale";

class MatchManager 
{
	private queues: Map<MatchRole, Set<Player>> = new Map();
	private handlers: Map<MatchRole, MatchModeHandler> = new Map();

	constructor() 
	{
		// Inicializa modos válidos con Set vacío
		const modes: MatchRole[] = ["1v1", "teams", "multi1v1", "tournament", "royale"];
		modes.forEach(mode => this.queues.set(mode, new Set()));
	}

	public registerHandler(mode: MatchRole, handler: MatchModeHandler): void 
	{
		this.handlers.set(mode, handler);
	}

	public addUser(mode: MatchRole, user: User): void
	{
		const player = new Player(user, "human");
		this.queues.get(mode)?.add(player);
	}

	public runMatching(): void
	{
		for (const [mode, handler] of this.handlers.entries())
		{
			const players = this.queues.get(mode);
			if (players && players.size > 0) {
				handler.handle(players);
			}
		}
	}
}
