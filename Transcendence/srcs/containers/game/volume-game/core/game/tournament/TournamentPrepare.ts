import { Tournament } from "../../entities/Tournament";
import { Player } from "../../entities/Player";
import { User } from "../../entities/User";
import { tournamentStart } from "./TournamentStart";


export const tournamentPrepare = async (mode: string, users: User[]) => 
{
	if (mode === "local")
	{
		const tournament = new Tournament(mode);
		const players: Player[] = [];

		let iterator = 0;
		while (iterator < users.length)
		{
			let newUser: User = {
				id: users[iterator].id,
				nickname: users[iterator].nickname,
				color: users[iterator].color,
				elo : 1000
			};
			const player = new Player(newUser, "human");
			players.push(player);
			iterator++;
		}
		tournament.allPlayers = players;
		console.log("tournament Started: ", tournament.id);
		await tournamentStart(tournament);
	}
	else
	{
		//Matchmaking
	}
}