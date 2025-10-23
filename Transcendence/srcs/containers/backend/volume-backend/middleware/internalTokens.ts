import { FastifyRequest, FastifyReply } from 'fastify';
import {INTERNAL_SECRET_BLOCKCHAIN, INTERNAL_SECRET_CHAT, INTERNAL_SECRET_GAME} from '../config'

export async function comesFromGame(request: FastifyRequest, reply: FastifyReply) {
	const token = request.headers['game-internal-token'];

	if (!token ) 
	{
		(request as any).game = false;
		return;
	}

	try
	{
		if (token !== INTERNAL_SECRET_GAME)
			(request as any).game = false;
		else
			(request as any).game  = true;
	} catch (err) 
	{
		(request as any).game = false;
	}
}

export async function comesFromChat(request: FastifyRequest, reply: FastifyReply) {
	const token = request.headers['chat-internal-token'];

	if (!token ) 
	{
		(request as any).chat = false;
		return;
	}

	try
	{
		if (token !== INTERNAL_SECRET_CHAT)
			(request as any).chat = false;
		else(request as any).chat  = true;
	} catch (err) 
	{
		(request as any).chat = false;
	}
}

export async function comesFromBlockchain(request: FastifyRequest, reply: FastifyReply) {
	const token = request.headers['blockchain-internal-token'];

	if (!token) 
	{
		(request as any).blockchain = false;
		return;
	}

	try
	{
		if (token !== INTERNAL_SECRET_BLOCKCHAIN)
			(request as any).blockchain = false;
		else(request as any).blockchain  = true;
	} catch (err) 
	{
		(request as any).blockchain = false;
	}
}
