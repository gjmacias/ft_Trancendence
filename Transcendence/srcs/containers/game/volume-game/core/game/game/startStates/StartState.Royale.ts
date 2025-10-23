import { TICKWAIT } from "../../../Constants/Constants";
import { Ball, createNewBall } from "../../../entities/Ball";
import { GameConfiguration } from "../../../entities/GameConfiguration";
import { GameState } from "../../../entities/GameState"
import { Light } from "../../../entities/Light";
import { Player } from "../../../entities/Player";
import { v4 as uuidv4 } from 'uuid';
import { Royale } from "../../../entities/Royale";
import { createStartRoundField, Field } from "../../../entities/Field";


export function RoyaleStartState(configuration : GameConfiguration, players: Player[]) : Royale
{
	const royale = new Royale;
	const gameState = new GameState
	try {

		gameState.id = uuidv4();
		gameState.timestamp = Date.now();
		gameState.players = players;
		gameState.balls = createsStartBalls();
		gameState.lights = createsStartLights();
		gameState.status = "waiting";
		gameState.field = createsStartField(gameState.players);
		gameState.configuration = configuration;
		gameState.tickWait = TICKWAIT;
		royale.gameState = gameState;
	} 
	catch (error) {
		console.error("❌", JSON.stringify(error))
	}
	return royale;
}

function createsStartBalls() : Ball[]
{
	const ball = createNewBall(1);
	return [ball];
}

function createsStartLights() : Light[]
{
	return Light[0];
}

function createsStartField(players : Player[]) : Field
{
	const field = createStartRoundField(1, players);
	return field;
}
