
import { myPongServer } from "../../../game";
import { Matchmaking } from "../../entities/Matchmaking";
import { gamePrepareRemote } from "../game/GamePrepare";
import { User } from "./../../entities/User";
import { TypeRole } from "./../../entities/GameConfiguration";

export async function matchmakingCreateGame(user : User) : Promise<string>
{
	const matchmaking = new Matchmaking();

	matchmaking.id = getMatchmakingId();

	matchmaking.allPlayers.push(user);
	myPongServer.matchmaking.add(matchmaking);

	for (const client of myPongServer.clients)
	{
		if (user.id === client.playerId)
		{
			user.ws = client.ws;
			break;
		}
	}
	console.log("Create matchmaking: ", matchmaking.id, ".Admin: ", user.id);
	return matchmaking.id;
}

function getMatchmakingId(): string {
	const maxInt = 999999;
	let number = Math.floor(Math.random() * maxInt);

	while ([...myPongServer.matchmaking].some(m => m.id === number.toString())) {
		number = (number + 1) % maxInt;
	}

	return number.toString().padStart(6, '0');
}

export async function matchmakingConnectGame(matchmakingId : string, user : User) : Promise<boolean>
{
	for (const matchmaking of myPongServer.matchmaking)
	{
		if (matchmaking.id === matchmakingId)
		{
			const alreadyIn = matchmaking.allPlayers.some(p => p.id === user.id);
			if (!alreadyIn)
			{
				matchmaking.allPlayers.push(user);
				for (const client of myPongServer.clients)
				{
					if (user.id === client.playerId)
					{
						user.ws = client.ws;
						break;
					}
				}
				console.log("Union matchmaking: ", matchmaking.id, ".User: ", user.id);
				return true;
			}
			else
			{
				console.log("User: ", user.id, "ALREADY IN", matchmaking.id);			
			}
		}
	}
	console.log("User: ", user.id, "FAILED to join in matchmaking: ", matchmakingId);
	return false;
}

export async function matchmakingStartGame(matchmakingId : string, sessionId : string) : Promise<boolean>
{
	for (const matchmaking of myPongServer.matchmaking)
	{
		if (matchmaking.id === matchmakingId)
		{
			const alreadyIn = matchmaking.allPlayers.some(p => p.id === sessionId);
			let nplayers = 0;

			for (const player of matchmaking.allPlayers)
				if (player.id !== "")
					nplayers++;

			if (alreadyIn 
				&& (nplayers === 2 
					|| nplayers === 4))
			{
				const role: TypeRole = (nplayers === 2) ? "1v1" : "teams";
				gamePrepareRemote(role, matchmaking.allPlayers);
				console.log("Matchmaking DELETE by START: ", matchmaking.id);
				matchmaking.id = "";
				myPongServer.matchmaking.delete(matchmaking);
				return true;
			}
		}
	}
	console.log("User: ", sessionId, "FAILED to join in matchmaking: ", matchmakingId);
	return false;
}