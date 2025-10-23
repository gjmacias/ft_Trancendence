import { Match } from "../../backend/models/match.model";

export interface IMatchRepository
{
	save(match: Match): Promise<number>;
	getLastMatchesByPlayerId(playerId: string): Promise<Match[]>;
}
