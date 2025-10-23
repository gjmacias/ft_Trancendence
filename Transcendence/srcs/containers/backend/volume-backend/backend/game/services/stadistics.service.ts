import { IStadisticsRepository } from "../../IRepositories/IStadisticsRepository";
import { Stadistics } from '../../models/stadistics.model';

export class StadisticsService {
	private repository: IStadisticsRepository;

	constructor(repository: IStadisticsRepository) 
	{
		this.repository = repository;
	}

	async create(userId: string): Promise<number> {
		const existing = await this.repository.selectStadisticsByUserId(userId);
		if (existing) throw new Error('Ya existen estadísticas para este usuario.');
		return this.repository.createStadistics(userId);
	}

	async getByUserId(userId: string): Promise<Stadistics | null> {
		return this.repository.selectStadisticsByUserId(userId);
	}

	async update(id: number, data: Partial<Stadistics>): Promise<number> {
		return this.repository.updateStadistics(id, data);
	}

	// ✅ Métodos de incremento de eventos
	async addWin(userId: string): Promise<void> {
		await this.repository.incrementWin(userId);
	}

	async addLoss(userId: string): Promise<void> {
		await this.repository.incrementLost(userId);
	}

	async addRoyaleWin(userId: string): Promise<void> {
		await this.repository.incrementWinRoyale(userId);
	}

	async addExperience(userId: string, amount: number): Promise<void> {
		if (amount <= 0) throw new Error('Cantidad de experiencia inválida');
		await this.repository.addExp(userId, amount);
	}

	async addEloPoints(userId: string, delta: number): Promise<void> {
		await this.repository.addElo(userId, delta);
	}

	// ✅ Actualizar récords
	async updateMaxScore(userId: string, newScore: number): Promise<void> {
		await this.repository.updateMaxScore(userId, newScore);
	}

	async updateMaxTime(userId: string, time: string): Promise<void> {
		// Validación simple (podrías usar Date.parse o regex ISO también)
		if (!time || isNaN(Date.parse(time))) {
			throw new Error('Formato de tiempo inválido');
		}
		await this.repository.updateMaxTime(userId, time);
	}

	async delete(id: number): Promise<void> {
		await this.repository.deleteStadistics(id);
	}
}
