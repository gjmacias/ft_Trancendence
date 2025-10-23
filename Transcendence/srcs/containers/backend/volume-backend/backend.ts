import Fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import multipart from '@fastify/multipart';

import fs from 'fs';
import path from 'path';
import https from 'https';

import './utils/backupCron.ts';
import './database/initTables.ts';

import { initSecrets, PORT_BACKEND } from './config.ts';
import routes from './routes.ts';
import { verify2FA, verifyJWT } from './middleware/auth.ts';
import { comesFromBlockchain, comesFromChat, comesFromGame } from './middleware/internalTokens.ts';
import metricsRoutes from './backend/monitoring/metrics.route';
import { MetricsService } from './backend/monitoring/metrics.service';
import { MetricsCollector } from './backend/monitoring/metrics.collector';


async function main()
{
	await initSecrets(); // 🔐 Solo una vez al inicio

	const metricsService = MetricsService.getInstance();

	// Inicializar recolector de métricas para demo (solo en desarrollo)
	if (process.env.NODE_ENV !== 'production') {
		new MetricsCollector();
	}
	
	//	---	HTTPS	---
	const httpsOptions = {
		key: fs.readFileSync(path.join(__dirname, '../certs/backend.key')),
		cert: fs.readFileSync(path.join(__dirname, '../certs/backend.crt')),
		ca: fs.readFileSync(path.join(__dirname, '../certs/ca.crt')),
	};

	const backend = Fastify({
		logger: true,
		https: httpsOptions,
	});

	// Middleware para métricas
	backend.addHook('onRequest', async (request, reply) => {
		request.startTime = Date.now();
	});

	backend.addHook('onResponse', async (request, reply) => {
		const duration = (Date.now() - request.startTime) / 1000;
		const contentLength = reply.getHeader('content-length');
		const responseSize = contentLength ? parseInt(contentLength.toString(), 10) : 0;
		
		metricsService.recordHttpRequest(
			request.method,
			request.routerPath || request.url,
			reply.statusCode,
			duration,
			responseSize
		);
	});
	//	---	COOKIES / ROUTES / MID	---
	backend.register(multipart); // necesario aunque uses multer -> guardar imagenes
	backend.register(fastifyCookie);
	backend.register(routes, { prefix: '/backend' });
	backend.register(require('@fastify/static'), {
	root: path.join(__dirname, './database/uploads'),
	prefix: '/uploads/',
	});

	backend.addHook('onRequest', verifyJWT);
	backend.addHook('onRequest', verify2FA);
	backend.addHook('onRequest', comesFromChat);
	backend.addHook('onRequest', comesFromGame);
	backend.addHook('onRequest', comesFromBlockchain);
	// Servir las imágenes
	backend.register(metricsRoutes, { prefix: '/backend' });

	// Actualizar métricas periódicas cada 30 segundos
	setInterval(async () => {
		await metricsService.updatePeriodicMetrics();
	}, 30000);

	backend.listen({ port: Number(PORT_BACKEND), host: '0.0.0.0' }, (err: any, address: any) => {
		if (err) {
			backend.log.error(err);
			process.exit(1);
		}
		backend.log.info(`Server listening at ${address}`);
		backend.log.info('📊 Metrics collection started - available at /backend/metrics');
	});
	return backend;
}
main(); // ⬅️ arranca todo aquí

export const httpsAgent = new https.Agent({
	ca: fs.readFileSync(path.join(__dirname, '../certs/ca.crt')),
});

export default main;
