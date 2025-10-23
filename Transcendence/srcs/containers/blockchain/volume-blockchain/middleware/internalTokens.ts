import { FastifyRequest, FastifyReply } from 'fastify';
import { INTERNAL_SECRET_BACKEND, INTERNAL_SECRET_GAME, INTERNAL_SECRET_BLOCKCHAIN} from '../config'

export async function comesFromGame(request: FastifyRequest, reply: FastifyReply) {
	const token = request.headers['game-internal-token'];

	if (!token) {
		(request as any).game = false;
		return;
	}

	try {
		if (token !== INTERNAL_SECRET_GAME) {
		(request as any).game = false;
		} else {
		(request as any).game = true;
		}
	} catch (err) {
		(request as any).game = false;
	}
}


export async function comesFromBackend(request: FastifyRequest, reply: FastifyReply) {
	const token = request.headers['backend-internal-token'];

	if (!token) {
		(request as any).backend = false;
		return;
	}

	try {
		if (token !== INTERNAL_SECRET_BACKEND) {
		(request as any).backend = false;
		} else {
		(request as any).backend = true;
		}
	} catch (err) {
		(request as any).backend = false;
	}
}

export async function comesFromBlockchain(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers['blockchain-internal-token'];

    if (!token) {
        (request as any).blockchain = false;
        return;
    }

    try {
        if (token !== INTERNAL_SECRET_BLOCKCHAIN) {
            (request as any).blockchain = false;
        } else {
            (request as any).blockchain = true;
        }
    } catch (err) {
        (request as any).blockchain = false;
    }
}