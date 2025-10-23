import { tournamentRepository } from '../../../database/repositories-sqlite/tournament.repository';

export class BlockchainTournamentService {
	private repository: tournamentRepository;

	constructor()
	{
		this.repository = new tournamentRepository();
	}
	async saveBlockchainTournament(id: number, contract_address: string, explorer_link: string,): Promise<void>
	{
		return this.repository.saveinfoBlockchain(id, contract_address, explorer_link);
	}
	async getBlockchainTournamentService(id: number): Promise<string>
	{
		return this.repository.getinfoBlockchain(id);
	}
}
