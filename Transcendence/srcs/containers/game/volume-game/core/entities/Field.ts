import { Player, setRotationWithWall } from './Player'; // Asegúrate de que la clase Player esté importada correctamente
import {
    FIELD_NORMAL_HEIGHT, FIELD_NORMAL_WIDTH, WALL_LEFT_ID, WALL_TOP_ID, WALL_RIGHT_ID, WALL_BOTTOM_ID,
    WALL_DEFAULT_FRICTION, WALL_NORMAL_COLOR, WALL_PLAYER_COLOR,
	WALL_NORMAL_DISTANCE
} from '../Constants/ConstFieldWall';
import { Vector3 } from './Vector3';
import { Point } from './Point';
import { normalize } from './Utils';

export type WallRole = "normal" | "playerIn" | "bounce";

export class Wall {
	id: number;                     // ID único de la pared
	start: Point; // Punto inicial (2D)
	end: Point;   // Punto final (2D)
	role: WallRole;
	friction: number;
	color: string;                 // Para renderizado
	players: Player[];         // Jugadores colocados en esta pared

	// Solo getters básicos que realmente necesitas
    get length(): number {
        const dx = this.end.position.x - this.start.position.x;
        const dy = this.end.position.y - this.start.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    get center(): { x: number; y: number } {
        return {
            x: (this.start.position.x + this.end.position.x) / 2,
            y: (this.start.position.y + this.end.position.y) / 2
        };
    }
	constructor()
	{
		this.players = [];
	}
}


// El campo de juego completo, contiene todas las paredes
export class Field {
	id: number;             // ID único del campo
	walls: Wall[];
	points: Point[];
	// Solo getter básico
    get wallCount(): number {
        return this.walls.length;
    }

	rotateField(deleteWall: Wall, referencePoint: Vector3): Vector3 {
		// Cuenta cuántos muros no son el eliminado
		let iterator = 0;
		for (const wall of this.walls) {
			if (wall.id !== deleteWall.id) iterator++;
		}

		// Ángulo en radianes
		const theta = (2 * Math.PI * iterator) / this.walls.length;
		const c = Math.cos(theta);
		const s = Math.sin(theta);

		// Trasladar al origen
		const dx = deleteWall.center.x - referencePoint.x;
		const dy = deleteWall.center.y - referencePoint.y;

		// Rotar
		const rx = dx * c - dy * s;
		const ry = dx * s + dy * c;

		// Volver a trasladar
		return normalize({x: rx + referencePoint.x,
        y: ry + referencePoint.y,
        z: referencePoint.z});
	}

}

export function createBasicField(id: number, players : Player[]): Field {
	const field = new Field();
	field.id = id;

	const number = 4;
	const points: Point[] = new Array(number);
	const walls: Wall[] = new Array(number);

	let iterator = 0;
	while (iterator < number)
	{
		const point = new Point();
		point.id = iterator;
		point.position.x = (iterator < 2) ? -(FIELD_NORMAL_WIDTH / 2) : (FIELD_NORMAL_WIDTH / 2); // ESTA A LA INVERSA POR QUE DEBE DE ESTAR EN EL EJE Y
		point.position.y = (iterator === 0 || iterator === 3) ? -(FIELD_NORMAL_HEIGHT / 2) : (FIELD_NORMAL_HEIGHT / 2);
		point.position.z = 0;

		points[iterator] = point;
		iterator++;
	}

	iterator = 0;
	while (iterator < number)
	{
		const wall = new Wall();
		wall.id = iterator;
		wall.role = "normal";
		wall.friction = WALL_DEFAULT_FRICTION;
		wall.color = WALL_PLAYER_COLOR;

		wall.start = points[iterator];
		const nextIndex = (iterator + 1) % number;
		wall.end = points[nextIndex];

		walls[iterator] = wall;
		iterator++;
	}

	for (let i = 0; i < players.length; i++)
	{
		const wallIndex = (i % 2 === 0) ? 0 : 2; // pares → 0, impares → 2

		walls[wallIndex].role = "playerIn";
		walls[wallIndex].players.push(players[i]);

		setRotationWithWall(players[i], walls[wallIndex]);
	}

	field.points = points;
	field.walls = walls;
	return field;
}


export function createStartRoundField(id: number, players : Player[]): Field {

	const numberPlayers = players.length;
	const referencePoint: Vector3 = {x :-1 , y: 0, z:0};
	const field = createNewRoundField(numberPlayers, referencePoint);
	const walls: Wall[] = new Array(numberPlayers);
	
	field.walls = walls;
	field.id = id;

	let iterator = 0;
	while (iterator < numberPlayers)
	{
		const wall = new Wall();
		wall.id = iterator;
		wall.role = "playerIn";
		wall.friction = WALL_DEFAULT_FRICTION;
		wall.color = WALL_PLAYER_COLOR;

		wall.start = field.points[iterator];
		const nextIndex = (iterator + 1) % numberPlayers;
		wall.end = field.points[nextIndex];

		field.walls[iterator] = wall;
		field.walls[iterator].players = players.length > 0 ? [players[iterator]] : [];
		setRotationWithWall(players[iterator], field.walls[iterator]);
		iterator++;
	}
	return field;
}

export function createNewRoundField(countActivePlayers: number, normalizedReferencePoint : Vector3): Field
{
	const field = new Field();
	const points: Point[] = new Array(countActivePlayers);
	const adjacent = (WALL_NORMAL_DISTANCE / 2)	
	const theta = ((Math.PI - ((2 * Math.PI) / countActivePlayers)) / 2) // ángulo en radianes

	const radius = adjacent / Math.cos(theta);

	const centerPoint: Vector3 = {x :0 , y: 0, z:0};

	const referenceVector: Vector3 = {
		x: normalizedReferencePoint.x - centerPoint.x , 
		y: normalizedReferencePoint.y - centerPoint.y , 
		z: normalizedReferencePoint.z - centerPoint.z 
	};
	
	normalize(referenceVector);

	const vector: Vector3 = {
		x : referenceVector.x * radius,
		y : referenceVector.y * radius,
		z : referenceVector.z * radius
	}
	let iterator = 0
	while (iterator < countActivePlayers)
	{
		const angle = -(((2 * Math.PI) / countActivePlayers) * iterator);

		const point = new Point();

		point.id = iterator;
		point.position.x = ((vector.x * Math.cos(angle)) - (vector.y * Math.sin(angle)));
		point.position.y = ((vector.x * Math.sin(angle)) + (vector.y * Math.cos(angle)));
		point.position.z = 0;

		points[iterator] = point
		iterator++;
	}
	field.points = points;
	return field;
}