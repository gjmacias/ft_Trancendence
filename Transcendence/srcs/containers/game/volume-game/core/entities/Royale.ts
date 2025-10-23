import { createNewRoundField, Field, Wall } from "./Field";
import { GameState } from "./GameState";
import { Point } from "./Point";

export class Royale
{
	newfield		: Field;
	duration		: number;
	startTime		: number;
	DeletedPlayers	: Wall[] = [];
	gameState		: GameState;
	pointsToJoin	: [Point, Point];
	moving			: boolean;

	constructor()
	{
		this.duration = 1000;
	}

	setNewField()
	{
		if (this.DeletedPlayers.length === 0) return;

		const walls = Array.from(this.DeletedPlayers);

		this.pointsToJoin = [walls[0].start, walls[0].end];
		const referencePoint = this.gameState.field.rotateField(walls[0],{x: 0,y: 0, z:0});

		this.newfield = createNewRoundField(this.gameState.numberActivePlayers(), referencePoint);
		this.moving = true;
	}

	updateField()
	{
		let iterator = 0;
		for (const point of this.gameState.field.points)
		{
			if (point.id === this.pointsToJoin[0].id)
				this.translatePoint(point, this.newfield[iterator]);
			else
				this.translatePoint(point, this.newfield[iterator++]);
		}
	}
	
	translatePoint(point: Point, newPoint :Point)
	{
		const t = Math.min((Date.now() - this.startTime) / this.duration, 1);

		// interpolación lineal
		point.position.x += (newPoint.position.x - point.position.x) * t;
		point.position.y += (newPoint.position.y - point.position.y) * t;

		// llegó al destino
		if (t === 1)
			this.endUpdateField();
	}

	endUpdateField()
	{
		for (const wall of this.gameState.field.walls)
		{
			if (wall.start === this.pointsToJoin[1])
			{	
				wall.start = this.pointsToJoin[0];
				break;
			}
		}
		this.DeletedPlayers.shift(); // saca el más viejo
		this.moving = false;
	}
}