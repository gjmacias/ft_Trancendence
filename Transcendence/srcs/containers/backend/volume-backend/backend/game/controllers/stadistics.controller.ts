import { FastifyRequest, FastifyReply } from 'fastify';
import { StadisticsService } from '../services/stadistics.service';
import { StadisticsRepository } from '../../../database/repositories-sqlite/stadistics.repository';

export class StadisticsController {
	private service: StadisticsService;

	constructor() { this.service = new StadisticsService(new StadisticsRepository); }

	create = async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
		try {
			const userId = request.params.userId;
			const id = await this.service.create(userId);
			reply.status(201).send({ id });
		} catch (err: any) {
			reply.status(400).send({ error: err.message });
		}
	}

	// GET /stadistics/:userId
	get = async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
		try {
			const userId = request.params.userId;
			const stats = await this.service.getByUserId(userId);
			if (!stats) {
				reply.status(404).send({ error: 'No se encontraron estadísticas.' });
				return;
			}
			reply.send(stats);
		} catch (err: any) {
			console.error(err);
			reply.status(400).send({ error: err.message });
		}
	}

	// PATCH /stadistics/:id
	update = async (request: FastifyRequest<{ Params: { id: string }, Body: any }>, reply: FastifyReply) => {
		try {
			const id = parseInt(request.params.id);
			const updatedId = await this.service.update(id, request.body);
			reply.send({ id: updatedId });
		} catch (err: any) {
			reply.status(400).send({ error: err.message });
		}
	}

	// DELETE /stadistics/:id
	delete = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		try {
			const id = parseInt(request.params.id);
			await this.service.delete(id);
			reply.status(204).send();
		} catch (err: any) {
			reply.status(400).send({ error: err.message });
		}
	}

	// POST /stadistics/:userId/win
	addWin = async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
		try {
			await this.service.addWin(request.params.userId);
			reply.status(200).send({ message: 'Victoria añadida' });
		} catch (err: any) {
			reply.status(400).send({ error: err.message });
		}
	}

	// POST /stadistics/:userId/loss
	addLoss = async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
		try {
			await this.service.addLoss(request.params.userId);
			reply.status(200).send({ message: 'Derrota añadida' });
		} catch (err: any) {
			reply.status(400).send({ error: err.message });
		}
	}

	// POST /stadistics/:userId/win-royale
	addWinRoyale = async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
		try {
			await this.service.addRoyaleWin(request.params.userId);
			reply.status(200).send({ message: 'Victoria Royale añadida' });
		} catch (err: any) {
			reply.status(400).send({ error: err.message });
		}
	}

	// POST /stadistics/:userId/exp
	addExp = async (request: FastifyRequest<{ Params: { userId: string }, Body: { amount: number } }>, reply: FastifyReply) => {
		try {
			const userId = request.params.userId;
			const { amount } = request.body;
			await this.service.addExperience(userId, amount);
			reply.send({ message: 'Experiencia añadida' });
		} catch (err: any) {
			reply.status(400).send({ error: err.message });
		}
	}

	// POST /stadistics/:userId/elo
	addElo = async (request: FastifyRequest<{ Params: { userId: string }, Body: { delta: number } }>, reply: FastifyReply) => {
		try {
			const userId = request.params.userId;
			const { delta } = request.body;
			await this.service.addEloPoints(userId, delta);
			reply.send({ message: 'ELO actualizado' });
		} catch (err: any) {
			reply.status(400).send({ error: err.message });
		}
	}

	// POST /stadistics/:userId/score
	updateMaxScore = async (request: FastifyRequest<{ Params: { userId: string }, Body: { score: number } }>, reply: FastifyReply) => {
		try {
			const userId = request.params.userId;
			const { score } = request.body;
			await this.service.updateMaxScore(userId, score);
			reply.send({ message: 'Score actualizado' });
		} catch (err: any) {
			reply.status(400).send({ error: err.message });
		}
	}

	// POST /stadistics/:userId/time
	updateMaxTime = async (request: FastifyRequest<{ Params: { userId: string }, Body: { time: string } }>, reply: FastifyReply) => {
		try {
			const userId = request.params.userId;
			const { time } = request.body;
			await this.service.updateMaxTime(userId, time);
			reply.send({ message: 'Tiempo actualizado' });
		} catch (err: any) {
			reply.status(400).send({ error: err.message });
		}
	}
}