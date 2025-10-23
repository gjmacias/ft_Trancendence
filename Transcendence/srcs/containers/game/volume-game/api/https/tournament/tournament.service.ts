// services/tournament.service.ts
import { tournamentPrepare } from '../../../core/game/tournament/TournamentPrepare';
import { User } from '../../../core/entities/User';
import { reconnectPlayer } from '../game/game.service'; // Importamos del service del 1v1
import { myPongServer } from '../../../game';

export function reconnectTournamentPlayer(userId: string): boolean
{
	const client = [...myPongServer.clients].find(c => c.playerId === userId);

	if (client && client.tournamentId)
	{
		const tournamentId = [...myPongServer.tournaments]
		.find(t=> t.id === client.tournamentId);

		if (tournamentId)
			return true;
	}

	return reconnectPlayer(userId);
}

export async function startTournament(mode: string, users: User[])
{
	return tournamentPrepare(mode, users);
}

export async function prepareLocalTournament(users: User[], id : string)
{
	for (const user of users)
	{
		user.id = id;
	}
}
