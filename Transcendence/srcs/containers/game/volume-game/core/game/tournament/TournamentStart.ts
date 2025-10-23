import { myPongServer } from "../../../game";
import { Tournament } from "../../entities/Tournament";
import { tournamentLoop } from "./TournamentLoop";

export async function tournamentStart(tournament : Tournament)
{
	try {
		myPongServer.tournaments.add(tournament);

		for(const client of myPongServer.clients)
		{
			if(tournament.allPlayers.find(p => p.id === client.playerId))
			client.tournamentId = tournament.id;
		}
		tournament.nextRoundPlayers = tournament.allPlayers;
		setTimeout(() => {}, 1000)
		await tournamentLoop(tournament);
	} 
	catch (error) 
	{
		console.error(error);
	}

}
