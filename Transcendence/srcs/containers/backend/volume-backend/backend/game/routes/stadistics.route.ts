import { FastifyPluginAsync } from 'fastify';
import { StadisticsController } from '../controllers/stadistics.controller';

const routes: FastifyPluginAsync = async (fastify) =>
{
	var controller = new StadisticsController()
	fastify.post('/stadistics/:userId', controller.create);
	fastify.get('/stadistics/:userId', controller.get);
	fastify.patch('/stadistics/:id', controller.update);
	fastify.delete('/stadistics/:id', controller.delete);

	fastify.post('/stadistics/:userId/win', controller.addWin);
	fastify.post('/stadistics/:userId/loss', controller.addLoss);
	fastify.post('/stadistics/:userId/win-royale', controller.addWinRoyale);
	fastify.post('/stadistics/:userId/exp', controller.addExp);
	fastify.post('/stadistics/:userId/elo', controller.addElo);
	fastify.post('/stadistics/:userId/score', controller.updateMaxScore);
	fastify.post('/stadistics/:userId/time', controller.updateMaxTime);
}

export default routes;