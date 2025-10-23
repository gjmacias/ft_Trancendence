import tap from 'tap';
import Fastify from 'fastify';
import userRoutes from '../backend/friendAndChat/routes/messages.route';

const buildFastify = () => {
  const app = Fastify();
  app.register(userRoutes, { prefix: '/sqlite' });
  return app;
};

// tap.test('Rutas mensajes - integración', async (t) => {
// 	const fastify = buildFastify();

// 	const sendResponse = await fastify.inject({
// 		method: 'POST',
// 		url: '/sqlite/messages',
// 		payload: {
// 			sender_id: 1,
// 			receiver_id: 2,
// 			content: 'Hola desde test',
// 		},
// 	});

// 	console.log('🔴 Response crear usuario stadistics', sendResponse.body);

// 	t.equal(sendResponse.statusCode, 201, 'POST /messages responde 201');
// 	const sentMessage = sendResponse.json();
// 	t.ok(sentMessage.id > 0, 'El mensaje tiene un ID');
// });

tap.test('Rutas mensajes - integración', async (t) => {
	const fastify = buildFastify();
	// 2. Obtener mensajes entre dos usuarios (GET /messages?sender_id=1&receiver_id=2)
	const getResponse = await fastify.inject({
		method: 'GET',
		url: '/sqlite/messages/1/2/20/0'
	});

	t.equal(getResponse.statusCode, 200, 'GET /messages responde 200');
	const messages = getResponse.json();
	t.ok(Array.isArray(messages), 'Devuelve un array de mensajes');

	// 2. Obtener mensajes entre dos usuarios (GET /messages?sender_id=1&receiver_id=2)
	const getResponse2 = await fastify.inject({
		method: 'GET',
		url: '/sqlite/messages/1/2/20/0'
	});

	t.equal(getResponse2.statusCode, 200, 'GET /messages responde 200');
	const messages2 = getResponse2.json();
	t.ok(Array.isArray(messages2), 'Devuelve un array de mensajes');
});

tap.test('Rutas mensajes - integración', async (t) => {
	const fastify = buildFastify();
	// 3. Marcar mensaje como leído (PUT /messages/:id/read)
	const markReadResponse = await fastify.inject({
		method: 'PUT',
		url: `/sqlite/messages/1/read`
	});

	console.log('🔴 Response crear usuario stadistics', markReadResponse.body);

	t.equal(markReadResponse.statusCode, 200, 'PUT /messages/:id/read responde 200');
	const markReadBody = markReadResponse.json();
	t.equal(markReadBody.read, true, 'Mensaje marcado como leído');

	await fastify.close();
});