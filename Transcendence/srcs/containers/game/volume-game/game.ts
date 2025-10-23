import Fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import websocket from '@fastify/websocket';

import fs from 'fs';
import path from 'path';
import https from 'https';

import { PORT_GAME } from './config.ts';
import routes from './routes.ts';
import { verifyJWT } from './middleware/jwt.ts';
import { PongServer } from './core/entities/PongServer.ts';

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '../certs/game.key')),
  cert: fs.readFileSync(path.join(__dirname, '../certs/game.crt')),
  ca: fs.readFileSync(path.join(__dirname, '../certs/ca.crt')),
};

const game = Fastify({
  logger: true,
  https: httpsOptions,
});
//	---	COOKIES / ROUTES / MID	---
game.register(fastifyCookie);
game.register(websocket);
game.register(routes, { prefix: '/game' });

game.addHook('onRequest', verifyJWT);

game.listen({ port: Number(PORT_GAME), host: '0.0.0.0' }, (err, address) => {
	if (err) {
		game.log.error(err);
		process.exit(1);
	}
	game.log.info(`Server listening at ${address}`);
});

// ----- EXPORTS -----

export const httpsAgent = new https.Agent({
	ca: fs.readFileSync(path.join(__dirname, '../certs/ca.crt')),
});

export const myPongServer = new PongServer();

export default game;





// ----- Tests -----
import { TournamentBracketAlgorithm } from "./core/algorithms/TournamentBracketAlgorithm.ts";
import { Player } from './core/entities/Player.ts';
import { User } from './core/entities/User.ts';

function testTournament()
{
	try
	{
		const length = 64;
		const users: User[] = Array.from({length}, (_, i) => ({
			id: String(i + 1),
			nickname: "player" + String(i + 1),
			elo: 2000 - (i * 10),
		}));
	
		console.log(users);
		let players: Player[] = [];
		for (let i = 0; i < length; i++) {
			const player = new Player(users[i], "human");
			players.push(player);
		}
		// Aplicar el algoritmo
		const bracket = TournamentBracketAlgorithm.createBalancedBracket(players);
		console.log("BRACKET: " + bracket);
	
		// Mostrar resultado
		TournamentBracketAlgorithm.displayBracket(bracket);
		console.log("BRACKET: ");
		console.log(JSON.stringify(bracket));
	}
	catch (error)
	{
		console.error(error);
	}
}

//testTournament();
