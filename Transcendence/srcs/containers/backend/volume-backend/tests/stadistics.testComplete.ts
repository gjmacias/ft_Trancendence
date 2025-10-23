import tap from 'tap';
import Fastify from 'fastify';
import userRoutes from '../backend/authentication/routes/stadistics.route';

const buildFastify = () => {
  const app = Fastify();
  app.register(userRoutes, { prefix: '/sqlite' });
  return app;
};

/*
**	*---------------------------------------------------------------*
**							CREAR STADISTICS
**	*---------------------------------------------------------------*
*/

const id = 12;

tap.test('POST /sqlite/stadistics - crear usuario stadistics', async (t) => {
	const fastify = buildFastify();

	const response = await fastify.inject({
		method: 'POST',
			url: '/sqlite/stadistics',
			payload: {
			userId: id
		},
	});  
	
	console.log('🔴 Response crear usuario stadistics', response.body);

	t.equal(response.statusCode, 201, 'Debe responder con 201');
	const body = JSON.parse(response.body);
	t.ok(body.id, 'Debe devolver el ID del usuario creado');
});

/*
**	*---------------------------------------------------------------*
**					UPDATEAR/BUSCAR USUARIO USUARIO
**	*---------------------------------------------------------------*
*/

tap.test('PUT /sqlite/stadistics/:id - actualizar nickname y email', async (t) => {
	const fastify = buildFastify();

	const value = 2;

	const updateResponse = await fastify.inject({
		method: 'PUT',
		url: `/sqlite/stadistics/${id}`,
		payload: {
			exp: value,
			elo: value,
			win_royale: value,
			win: value,
			lost: value,
			max_time: value,
			max_score: value,
			level: value
		},
	});
	console.log('🔴 Response UPDATED:', updateResponse.body);
	t.equal(updateResponse.statusCode, 200, 'Debe responder con 200 OK');

	const getResponseByID = await fastify.inject({
		method: 'GET',
		url: `/sqlite/stadistics/${id}`,
		payload: {
			userId: id
		},
	});

	const stadisticsByID = JSON.parse(getResponseByID.body);
	console.log('🔴 Response getResponseByID:', getResponseByID.body);
	t.equal(stadisticsByID.elo, value, 'comparacion');

});