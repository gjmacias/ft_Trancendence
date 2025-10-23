import { myPongServer } from "../../../../game";
import { TICKWAIT } from "../../../Constants/Constants";
import { Ball, createNewBall } from "../../../entities/Ball";
import { Camera, createCamera } from "../../../entities/Camera";
import { createBasicField, Field } from "../../../entities/Field";
import { GameConfiguration } from "../../../entities/GameConfiguration";
import { GameState } from "../../../entities/GameState";
import { Light } from "../../../entities/Light";
import { Player } from "../../../entities/Player"
import { v4 as uuidv4 } from 'uuid';

export function RemoteStartState(configuration : GameConfiguration, players: Player[]) : GameState
{
	const gameState = new GameState

	gameState.id = uuidv4();
	gameState.players = players;
	gameState.balls = createsStartBalls();
	gameState.lights = createsStartLights();
	gameState.status = "waiting";
	gameState.field = createsStartField(gameState.players);
	gameState.configuration = configuration;
	gameState.tickWait = TICKWAIT;

	return gameState
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
	const field = createBasicField(1, players);
	return field;
}
