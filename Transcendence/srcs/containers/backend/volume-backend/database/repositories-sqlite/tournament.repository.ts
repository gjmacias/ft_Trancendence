import { ITournamentRepository } from '../../backend/IRepositories/ITournamentRepository';
import db from '../connection.sqlite';
import { Tournament } from '../../backend/models/tournament.model';

export class tournamentRepository implements ITournamentRepository
{
	saveTournament(tournament: Tournament): Promise<number>
	{
		return new Promise((resolve, reject) =>
		{
			const sql = `
				INSERT INTO tournament (
				winner,
				second,
				rest,
				finished,
				contract_address,
				explorer_link
				) VALUES (?, ?, ?, ?, ?, ?)
			`;

			const params = [
				tournament.winner,
				tournament.second,
				tournament.rest,
				tournament.finished,
				tournament.contract_address || null,
				tournament.explorer_link || null
			];

			db.run(sql, params, function (err)
			{
				if (err)
					reject(err);
				else
					resolve(this.lastID)
			});
		});
	}

	saveinfoBlockchain(id: number, contract_address: string, explorer_link: string): Promise<void>
	{
		return new Promise((resolve, reject) => {
			const sql = `
			UPDATE tournament
			SET 
				contract_address = ?,
				explorer_link = ?
			WHERE id = ?
			`;

			const params = [contract_address, explorer_link, id];

			db.run(sql, params, function (err) {
			if (err) reject(err);
			else resolve();
			});
		});
	}

	getinfoBlockchain(id: number): Promise<string>
	{
		return new Promise((resolve, reject) => 
		{
			const sql = `
				SELECT explorer_link
				FROM tournament 
				WHERE id = ?`;

			db.get(sql, [id], (err, row) =>
			{
				if (err) reject(err);
				else resolve(row ?? "");
			});
		});
	}
}