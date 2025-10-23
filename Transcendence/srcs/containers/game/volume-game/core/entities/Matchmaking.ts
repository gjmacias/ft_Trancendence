import { GameConfiguration } from "./GameConfiguration";
import { User } from "./User";
import { v4 as uuidv4 } from 'uuid';

export class Matchmaking
{
	id: string;
	allPlayers: User[];

	constructor()
	{
		this.id = uuidv4();
		this.allPlayers = [];
	}
}