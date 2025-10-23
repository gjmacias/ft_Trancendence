import { Player } from "../entities/Player";

const MAX_QUEUE = 500;

export type InputRole = 
	| "health" 
	| "game" 
	| "tournament"
	| "starter";

export type HealthCommand =
	| "PING"
	| "imReady";

export type GameCommand =
	| "startGoUp"
	| "startGoDown"
	| "stopGoUp"
	| "stopGoDown"
	| "powerUp1"
	| "powerUp2"
	| "powerUp3"
	| "startGoUpPlayer2"
	| "startGoDownPlayer2"
	| "stopGoUpPlayer2"
	| "stopGoDownPlayer2"
	| "powerUp1Player2"
	| "powerUp2Player2"
	| "powerUp3Player2"
	| "imReady";

export type TournamentCommand =
  | "imReady";

export type CommandsByRole = {
	health: HealthCommand;
	game: GameCommand;
	tournament: TournamentCommand;
	starter: string; // libre
};

export type InputEvent<R extends InputRole = InputRole> = 
{
	playerId: string;
	type: R;
	command: CommandsByRole[R]; // depende del rol
	timestamp?: number;
};

let inputQueue: InputEvent[] = [];





export const queueInput = <R extends InputRole>(input: InputEvent<R>) =>
{
	if (inputQueue.length >= MAX_QUEUE)
	{
		inputQueue.shift(); // descarta el más viejo
	}
	inputQueue.push(input);
};

export const consumeInputs = (players: Player[]): InputEvent[] =>
{
	const playerIds = new Set(players.map(p => p.id));

	// Filtrar los inputs que queremos consumir
	const inputsToConsume = inputQueue.filter(input => playerIds.has(input.playerId));

	// Dejar en la cola solo los que NO se consumieron
	inputQueue = inputQueue.filter(input => !playerIds.has(input.playerId));

	return inputsToConsume;
};

export function isValidInput(input: any): input is InputEvent 
{
	if (typeof input !== "object" || input === null) return false;
	if (typeof input.playerId !== "string") return false;
	if (!["health", "game", "tournament", "starter"].includes(input.type)) return false;

	const validCommands: Record<InputRole, string[]> =
	{
		health: ["PING", "imReady"],
		game: [
		"startGoUp","startGoDown","stopGoUp","stopGoDown",
		"powerUp1","powerUp2","powerUp3",
		"startGoUpPlayer2","startGoDownPlayer2","stopGoUpPlayer2","stopGoDownPlayer2",
		"powerUp1Player2","powerUp2Player2","powerUp3Player2",
		"imReady"
		],
		tournament: ["imReady"],
		starter: [] // acepta cualquier string → validación especial abajo
	};

	if (input.type === "starter")
	{
		return typeof input.command === "string"; // libre
	}
	return validCommands[input.type].includes(input.command);
}

export function isValidStarterInput(command: string): boolean
{
	const parameters = command.split(" ");

	if (parameters.length != 6)
		return false;
	//... faltan las demas comrobaciones
	return true;
}

