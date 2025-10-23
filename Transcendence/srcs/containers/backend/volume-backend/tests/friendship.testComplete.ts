import tap from 'tap';
import Fastify from 'fastify';
import userRoutes from '../backend/friendAndChat/routes/friendship.route';

const buildFastify = () => {
  const app = Fastify();
  app.register(userRoutes, { prefix: '/sqlite' });
  return app;
};

// tap.test('POST /sqlite/friendships - crear amistad', async (t) => {
// 	const fastify = buildFastify();

// 	const response = await fastify.inject({
// 		method: 'POST',
// 		url: '/sqlite/friendships',
// 		payload: {
// 		requester_id: 1,
// 		addressee_id: 5,
// 		},
// 	});
// 	console.log('🔴 Response crear usuario stadistics', response.body);

// 	t.equal(response.statusCode, 201, 'Debe responder con 201');
// 	const body = JSON.parse(response.payload);
// 	t.ok(body.id > 0, 'Debe devolver un ID');
// 	await fastify.close();
// });

tap.test('POST /sqlite/friendships/:userId/respond/:requesterId - aceptar solicitud', async (t) => {
	const fastify = buildFastify();

	const response = await fastify.inject({
		method: 'POST',
		url: '/sqlite/friendships/5/respond/1',
		payload: {
			status: 'accepted',
		},
	});

	t.equal(response.statusCode, 200, 'Debe responder con 200');
	const body = JSON.parse(response.payload);
	t.ok(body.changes >= 1, 'Debe actualizar al menos 1 fila');
	await fastify.close();
});

tap.test('POST /sqlite/friendships/:userId/respond/:requesterId - cancelar solicitud', async (t) => {
	const fastify = buildFastify();

	const response = await fastify.inject({
		method: 'POST',
		url: '/sqlite/friendships/2/respond/1',
		payload: {
			status: 'cancelled',
		},
	});

	t.equal(response.statusCode, 200, 'Debe responder con 200');
	const body = JSON.parse(response.payload);
	t.ok(body.changes >= 1, 'Debe actualizar al menos 1 fila');
	await fastify.close();
});

tap.test('POST /sqlite/friendships/:userId/block/:otherUserId - bloquear usuario', async (t) => {
	const fastify = buildFastify();

	const response = await fastify.inject({
		method: 'POST',
		url: '/sqlite/friendships/1/block/2',
	});
		
	t.equal(response.statusCode, 200, 'Debe responder con 200');
	const body = JSON.parse(response.payload);
	t.ok(body.changes >= 1, 'Debe bloquear relación');
	await fastify.close();
});

tap.test('GET /sqlite/friendships/list/:userId - listar amigos', async (t) => {
	const fastify = buildFastify();

	const response = await fastify.inject({
		method: 'GET',
		url: '/sqlite/friendships/list/1',
	});


	t.equal(response.statusCode, 200, 'Debe responder con 200');
	const friends = JSON.parse(response.payload);

	console.log('🔴 Response friend listar amigos', friends);

	t.ok(Array.isArray(friends), 'Debe devolver un array');
	await fastify.close();
});
