import { IStadisticsRepository } from "../../backend/IRepositories/IStadisticsRepository";
import db from '../connection.sqlite';
import { Stadistics } from '../../backend/models/stadistics.model';

export class StadisticsRepository implements IStadisticsRepository
{
	createStadistics(userId: string): Promise<number>
	{
		const sql = `
			INSERT INTO stadistics (user_id, elo, exp, level, win_royale, win, lost, max_time, max_score)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;

		const values = [
			userId,
			1000,   // elo inicial
			0,      // exp
			0,      // level
			0,      // win_royale
			0,      // win
			0,      // lost
			null,   // max_time (asumiendo que es texto y puede ser null)
			0       // max_score
		];
		return new Promise((resolve, reject) =>
		{
			db.run(sql, values, function (err: Error | null) {
			if (err) 
				reject(err);
			else 
				resolve(this.lastID);
			});
		});
	};

	selectStadisticsByUserId(userId: string): Promise<Stadistics | null>
	{
		const sql = `
			SELECT id, user_id, elo, exp, level, win_royale, win, lost, max_time, max_score
			FROM stadistics
			WHERE user_id = ?
		`;
		console.log(userId)
		return new Promise((resolve, reject) => {
			db.get(sql, [userId], (err, row) => {
			if (err) 
				reject(err);
			else 
			resolve(row ?? null);
			});
		});
	};

	updateStadistics(id: number, data: Partial<Stadistics>): Promise<number>
	{
		const sql = `
			UPDATE stadistics SET
			elo = COALESCE(?, elo),
			exp = COALESCE(?, exp),
			level = COALESCE(?, level),
			win_royale = COALESCE(?, win_royale),
			win = COALESCE(?, win),
			lost = COALESCE(?, lost),
			max_time = COALESCE(?, max_time),
			max_score = COALESCE(?, max_score)
			WHERE user_id = ?
		`;

		const values = [
			data.exp ?? null,
			data.elo ?? null,
			data.level ?? null,
			data.win_royale ?? null,
			data.win ?? null,
			data.lost ?? null,
			data.max_time ?? null,
			data.max_score ?? null,
			id
		];

		return new Promise<number>((resolve, reject) => {
			db.run(sql, values, function (this: { changes: number }, err: Error | null) {
			if (err)
				reject(err);
			else 
				resolve(this.changes); // cuántas filas se modificaron
			});
		});
	};

	deleteStadistics(id: number): Promise<void>
	{
		return new Promise((resolve, reject) => {
			db.run('DELETE FROM stadistics WHERE id = ?', [id], function (err) {
			if (err) 
				reject(err);
			else 
				resolve();
			});
		});
	};

	incrementWin(userId: string): Promise<void>
	{
		return this._incrementField(userId, 'win');
	}

	incrementLost(userId: string): Promise<void>
	{
		return this._incrementField(userId, 'lost');
	}

	incrementWinRoyale(userId: string): Promise<void>
	{
		return this._incrementField(userId, 'win_royale');
	}

	addExp(userId: string, amount: number): Promise<void>
	{
		const sql = `UPDATE stadistics SET exp = exp + ? WHERE user_id = ?`;
		return this._runAtomic(sql, [amount, userId]);
	}

	addElo(userId: string, delta: number): Promise<void>
	{
		const sql = `UPDATE stadistics SET elo = elo + ? WHERE user_id = ?`;
		return this._runAtomic(sql, [delta, userId]);
	}

	updateMaxScore(userId: string, score: number): Promise<void>
	{
		const sql = `UPDATE stadistics SET max_score = MAX(max_score, ?) WHERE user_id = ?`;
		return this._runAtomic(sql, [score, userId]);
	}

	updateMaxTime(userId: string, time: string): Promise<void>
	{
		const sql = `UPDATE stadistics SET max_time = ? WHERE user_id = ?`;
		return this._runAtomic(sql, [time, userId]);
	}

	// Utilidades privadas

	private _incrementField(userId: string, field: string): Promise<void>
	{
		const sql = `UPDATE stadistics SET ${field} = ${field} + 1 WHERE user_id = ?`;
		return this._runAtomic(sql, [userId]);
	}

	private _runAtomic(sql: string, values: any[]): Promise<void>
	{
		return new Promise((resolve, reject) =>
		{
			db.run(sql, values, function (err: Error | null) {
				if (err) reject(err);
				else resolve();
			});
		});
	}
}