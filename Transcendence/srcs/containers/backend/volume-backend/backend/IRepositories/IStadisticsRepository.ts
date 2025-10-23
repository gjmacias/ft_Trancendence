import { Stadistics } from "../../backend/models/stadistics.model";

export interface IStadisticsRepository {
	createStadistics(userId: string): Promise<number>;
	selectStadisticsByUserId(userId: string): Promise<Stadistics | null>;
	updateStadistics(id: number, data: Partial<Stadistics>): Promise<number>;

	// INCREMENTS (atómicos y seguros)
	incrementWin(userId: string): Promise<void>;
	incrementLost(userId: string): Promise<void>;
	incrementWinRoyale(userId: string): Promise<void>;
	addExp(userId: string, amount: number): Promise<void>;
	addElo(userId: string, delta: number): Promise<void>;
	updateMaxScore(userId: string, score: number): Promise<void>;
	updateMaxTime(userId: string, time: string): Promise<void>; // ISO string

	// BORRADO (admin/uso interno)
	deleteStadistics(id: number): Promise<void>;
}
