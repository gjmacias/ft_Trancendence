import axios from 'axios';

import { ITournamentRepository } from '../../IRepositories/ITournamentRepository';
import { Tournament } from '../../models/tournament.model';
import { INTERNAL_SECRET_BACKEND, PORT_BLOCKCHAIN, INTERNAL_SECRET_BLOCKCHAIN } from "../../../config";

import { httpsAgent } from '../../../backend';

export class TournamentService {
	private repository: ITournamentRepository;

	constructor(repository: ITournamentRepository) 
	{
		this.repository = repository;
	}
	async saveTournament(Tournament: Tournament): Promise<number>
	{
		let id: number;
		try 
		{
			id = await this.repository.saveTournament(Tournament);
			console.log("Tournament saved with id:", id);
			await axios.post
			(
				`https://blockchain:${PORT_BLOCKCHAIN}/blockchain/deploy`,
				{
					gameResult: {
						id: id,
						winner: Tournament.winner,
						second: Tournament.second,
						rest: Tournament.rest,
						finished: Tournament.finished,
					}
				},
				{
					headers: {
					"Content-Type": "application/json",
					"blockchain-internal-token": INTERNAL_SECRET_BLOCKCHAIN,
					},
					httpsAgent,
				}
			);
		} 
		catch (error) {
			console.error(error);
			throw error;
		}
		return id;
	}
}
