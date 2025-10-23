import { TIME_GAME_DEFAULT, WIN_SCORE_DEFAULT } from "../Constants/Constants";

export type TypeRole = "1v1" | "teams" | "multi1v1" | "royale" | "tournament";

export class GameConfiguration
{
	type: TypeRole;
	cloudConection: Boolean; //"local" | "remote"
	hasBots: Boolean;
	havePowerUps: Boolean;
	maxTime: number | null;
	winScore: number | null;

	constructor(mode: string, type: TypeRole)
	{
		this.type = type;
		this.cloudConection = false;
		this.hasBots = false;
		this.havePowerUps = false;
		this.maxTime = TIME_GAME_DEFAULT;
		this.winScore = WIN_SCORE_DEFAULT;

		switch (mode)
		{
			case 'local':
				break;
			case 'bot':
				this.hasBots = true;
			 	break;
			case 'remote':
				this.cloudConection = true;
				break;
			case 'test':
				break;
			default:
				throw new Error('Modo "Game Prepare" no válido');
		} 
	}
}