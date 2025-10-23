import { broadcastTournamentMatch } from "../../../api/wss/services/socket.service";
import { TIME_GAME_RESULT, TIME_TOURNAMENT_ANNONCEMENT } from "../../Constants/Constants";
import { Player } from "../../entities/Player";
import { Tournament } from "../../entities/Tournament";
import { sleep } from "../../entities/Utils";
import { gameStart } from "../game/GameStart";
import { TournamentEnd } from "./TournamentEnd";

export async function tournamentLoop(tournament : Tournament)
{
	try 
	{
		const realId = tournament.allPlayers[0].id;
		while (tournament.nextRoundPlayers.length > 1)
		{
			tournament.nextRoundPlayers.sort((a, b) => b.elo - a.elo);
			const newStack: Player[] = [];

			for (let i = 0; i < tournament.nextRoundPlayers.length; i += 2)
			{
				const player1 = tournament.nextRoundPlayers[i];
				const player2 = tournament.nextRoundPlayers[i + 1];

				if (!player2)
				{
					newStack.push(player1);
					continue;
				}

				player1.id = realId;
				player2.id = "";
				const playersDuel: Player[] = [player1, player2];
				broadcastTournamentMatch(tournament, playersDuel)
				await sleep(TIME_TOURNAMENT_ANNONCEMENT);

				tournament.status =  "running";
				const winner = await gameStart(tournament.configuration, playersDuel);
				await sleep(TIME_GAME_RESULT);
				tournament.status =  "paused";

				if (player1.id === winner)
					newStack.push(player1);
				else
					newStack.push(player2);
			}
			if (tournament.nextRoundPlayers.length == 2 || tournament.status == "ended")
			{
				tournament.status = "ended";
				tournament.winner = newStack[0].nickname;
				TournamentEnd(newStack[0], tournament);
				return;
			}
			tournament.nextRoundPlayers = newStack;
		}
	} 
	catch (error) 
	{
		console.error(error);
	}

}
