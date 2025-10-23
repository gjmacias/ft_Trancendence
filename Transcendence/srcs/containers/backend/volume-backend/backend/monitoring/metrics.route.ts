import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { MetricsService } from './metrics.service';

export default async function metricsRoutes(fastify: FastifyInstance) {
    const metricsService = MetricsService.getInstance();

    fastify.get('/metrics', {
        preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            // Bypass authentication for metrics endpoint
            return;
        }
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const metrics = await metricsService.getMetrics();
            reply
                .type('text/plain; charset=utf-8')
                .send(metrics);
        } catch (error) {
            reply.status(500).send({ error: 'Failed to get metrics' });
        }
    });
}