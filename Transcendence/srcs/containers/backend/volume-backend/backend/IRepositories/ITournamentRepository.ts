import { Tournament } from "../models/tournament.model";

export interface ITournamentRepository
{
	saveTournament(match: Tournament): Promise<number>;
	saveinfoBlockchain(id: number, contract_address: string, explorer_link: string): Promise<void>;
}
