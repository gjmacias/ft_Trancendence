import { FastifyRequest, FastifyReply } from 'fastify';
import { BlockchainTournamentService } from '../services/BlockchainTournament.service';

export class BlockchainTournamentController
{
	private service: BlockchainTournamentService;

	constructor() { this.service = new BlockchainTournamentService(); }

	saveBlockchainTournament = async (request: FastifyRequest, reply: FastifyReply) =>
	{
		if (!request.blockchain)
		{
			return reply.status(403).send({ error: 'Forbbiden' });
		}
		try
		{
			const {id, contract_address, explorer_link} = request.body;
			await this.service.saveBlockchainTournament(id, contract_address, explorer_link);
			return reply.status(200).send({ id });
		} catch (error)
		{
			return reply.status(500).send({ error: 'Error saving match' });
		}
	};

	getBlockchainTournament = async (request: FastifyRequest, reply: FastifyReply) =>
	{
		try
		{
			const {id} = request.params;
			const explorer_link = await this.service.getBlockchainTournamentService(id);
			if(explorer_link != "")
				return reply.status(200).send(explorer_link);
			else
				return reply.status(404).send({error: 'Error finding match'});
		} catch (error)
		{
			return reply.status(500).send({ error: 'Error saving match' });
		}
	};
}
