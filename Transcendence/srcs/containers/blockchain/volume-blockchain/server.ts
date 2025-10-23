import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fs from 'fs';
import path from 'path';
import https from 'https';

import deployRoutes from './routes/deployRoutes';
import { PORT_BLOCKCHAIN } from './config';
import { comesFromBackend, comesFromGame } from './middleware/internalTokens';

const port = Number(PORT_BLOCKCHAIN);


//	---	HTTPS	---
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '../certs/blockchain.key')),
  cert: fs.readFileSync(path.join(__dirname, '../certs/blockchain.crt')),
  ca: fs.readFileSync(path.join(__dirname, '../certs/ca.crt')),
};

const blockchain = Fastify({
  logger: true,
  https: httpsOptions,
});

// Register routes
blockchain.register(fastifyCookie);
blockchain.register(deployRoutes, { prefix: '/blockchain' });
blockchain.addHook('onRequest', comesFromGame);
blockchain.addHook('onRequest', comesFromBackend);

// Start server
blockchain.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    blockchain.log.error(err);
    process.exit(1);
  }
  blockchain.log.info(`Blockchain service running at ${address}`);
});

export const httpsAgent = new https.Agent({
	ca: fs.readFileSync(path.join(__dirname, '../certs/ca.crt')),
});