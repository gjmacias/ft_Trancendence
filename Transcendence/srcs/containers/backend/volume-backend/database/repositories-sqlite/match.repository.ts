import { IMatchRepository } from '../../backend/IRepositories/IMatchRepository';
import db from '../connection.sqlite';
import { Match } from '../../backend/models/match.model';

export class matchRepository implements IMatchRepository
{
	save(match: Match): Promise<number>
	{
		return new Promise((resolve, reject) =>
		{
			const winner_id =
				match.score1 > match.score2 ? match.player1_id :
				match.score2 > match.score1 ? match.player2_id :
				null;

			const sql = `
				INSERT INTO match (
				player1_id,
				player2_id,
				score1,
				score2,
				winner_id,
				duration,
				mode
				) VALUES (?, ?, ?, ?, ?, ?, ?)
			`;

			const params = [
				match.player1_id,
				match.player2_id,
				match.score1,
				match.score2,
				winner_id,
				match.duration || null,
				match.mode || null
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

	getLastMatchesByPlayerId(playerId: string): Promise<Match[]>
	{
		return new Promise((resolve, reject) =>
		{
			const sql = `
				SELECT * FROM match
				WHERE player1_id = ? OR player2_id = ?
				ORDER BY created_at DESC
				LIMIT 20
			`;

			const params = [playerId, playerId];

			db.all(sql, params, (err, rows) =>
			{
				if (err)
					reject(err);
				else
					resolve(rows as Match[]);
			});
		});
	}
}