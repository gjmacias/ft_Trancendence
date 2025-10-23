import axios from 'axios';

import { INTERNAL_SECRET_GAME, PORT_BACKEND } from "../../../config";
import { Player } from "../../entities/Player";
import { httpsAgent, myPongServer } from '../../../game';
import { Tournament } from '../../entities/Tournament';
import { broadcastTournamentResult, broadcastTournamentBlockchain} from '../../../api/wss/services/socket.service';

export async function TournamentEnd(newStack: Player, tournament : Tournament)
{
	const secondPlayer = tournament.nextRoundPlayers.find(p => p.id !== newStack.id);

	const restPlayers = tournament.allPlayers.filter(
		p => p.nickname !== newStack.nickname && p.nickname !== secondPlayer!.nickname
	);

	const winner = newStack.nickname;
	const second = secondPlayer?.nickname ?? "Unknow";
	const rest = restPlayers.map(p => p.nickname).join(", ");
	
	for (const client of myPongServer.clients)
	{
		if (tournament.allPlayers.some(p => p.id === client.playerId))
		{
			client.gameId = undefined;
		}
	}

	broadcastTournamentResult(tournament, newStack, secondPlayer!);
	try
	{
		const blockchain = await axios.post
		(
			`https://backend:${PORT_BACKEND}/backend/game/tournament`,
			{
				winner: winner,
				second: second,
				rest: rest,
				finished: Date.now(),
			},
			{
				headers: 
				{
					"Content-Type": "application/json",
					"game-internal-token": INTERNAL_SECRET_GAME,
				},
				httpsAgent,
			}
		);
		const id = blockchain.data.id;
		broadcastTournamentBlockchain(tournament, id);
	} catch (error) 
	{
		console.log(JSON.stringify(error));
	}

	console.log("tournament Ended: ", tournament.id);
	for (const player of tournament.allPlayers)
	{
		player.id = "";
	}
	myPongServer.tournaments.delete(tournament);
}