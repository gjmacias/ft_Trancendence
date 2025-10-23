import { Camera } from './Camera';
import { Field } from './Field';
import { Player } from './Player';
import { Ball } from './Ball';
import { Light } from './Light';
import { PowerUp } from './PowerUp';

export type GameState = {
  id: number,
	timestamp: number,
	camera: Camera,
	field: Field,
	players: Player[],
	balls: Ball[],
	lights: Light[],
	powerUps: PowerUp[],
	events: any[],
	scores: number[],
	status: "waiting" | "running" | "paused" | "ended",
	winner: Player | null,
	maxScore: number
}
