import tap from 'tap';
import Fastify from 'fastify';
import userRoutes from '../modules/users/users.route';

const buildFastify = () => {
  const app = Fastify();
  app.register(userRoutes, { prefix: '/sqlite' });
  return app;
};

/*
**	*---------------------------------------------------------------*
**							CREAR USUARIO
**	*---------------------------------------------------------------*
*/

tap.test('POST /sqlite/users - crear usuario con email y password', async (t) => {
	const fastify = buildFastify();

	const response = await fastify.inject({
		method: 'POST',
		url: '/sqlite/users',
		payload: {
		nickname: 'usuario_email',
		email: 'usuario@example.com',
		password: 'supersecreto'
		},
	});  
	
	console.log('🔴 Response crear email y password:', response.body);

	t.equal(response.statusCode, 201, 'Debe responder con 201');
	const body = JSON.parse(response.body);
	t.ok(body.id, 'Debe devolver el ID del usuario creado');
});


tap.test('POST /sqlite/users - crear usuario con id_google', async (t) => {
	const fastify = buildFastify();

	const response = await fastify.inject({
		method: 'POST',
		url: '/sqlite/users',
		payload: {
		nickname: 'usuario_google',
		id_google: 'token12345'
		},
	});

	console.log('🔴 Response crear id_google:', response.body);

	t.equal(response.statusCode, 201, 'Debe responder con 201');
	const body = JSON.parse(response.body);
	t.ok(body.id, 'Debe devolver el ID del usuario creado');
});

tap.test('POST /sqlite/users - crear usuario con id_42', async (t) => {
	const fastify = buildFastify();

	const response = await fastify.inject({
		method: 'POST',
		url: '/sqlite/users',
		payload: {
		nickname: 'usuario_42',
		id_42: 'token42xyz'
		},
	});

		console.log('🔴 Response crear id_42:', response.body);

	t.equal(response.statusCode, 201, 'Debe responder con 201');
	const body = JSON.parse(response.body);
	t.ok(body.id, 'Debe devolver el ID del usuario creado');
});

/*
**	*---------------------------------------------------------------*
**					UPDATEAR/BUSCAR USUARIO USUARIO
**	*---------------------------------------------------------------*
*/

tap.test('PUT /sqlite/users/:id - actualizar nickname y email', async (t) => {
	const fastify = buildFastify();

	const id = 1;
	// Actualizar el nickname y email
	const updateResponse = await fastify.inject({
		method: 'PUT',
		url: `/sqlite/users/${id}`,
		payload: {
		nickname: 'despues',
		email: 'nuevo@example.com',
		password: 'nuevo123'
		},
	});
	console.log('🔴 Response UPDATED:', updateResponse.body);
	t.equal(updateResponse.statusCode, 200, 'Debe responder con 200 OK');

	const getResponseByID = await fastify.inject({
		method: 'GET',
		url: `/sqlite/users/userid/${id}`,
	});

	const usuarioByID = JSON.parse(getResponseByID.body);
	console.log('🔴 Response getResponseByID:', getResponseByID.body);
	t.equal(usuarioByID.nickname, 'despues', 'El nickname debe haberse actualizado');

});

// tap.test('GET /sqlite/users/nick/:nickname - buscar usuario por nickname', async (t) => {}); // TODO
// tap.test('GET /sqlite/users/email/:email - buscar usuario por email', async (t) => {}); // TODO
// tap.test('GET /sqlite/users/userid/:id - buscar usuario por id', async (t) => {}); // TODO
// tap.test('GET /sqlite/users/id_google/:id_google - buscar usuario por id_google', async (t) => {}); // TODO
// tap.test('GET /sqlite/users/id_42/:id_42 - buscar usuario por id_42', async (t) => {}); // TODO
