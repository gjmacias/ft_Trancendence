import { Ball } from "../../entities/Ball";
import { Player } from "../../entities/Player";

// Función para rotar un punto alrededor del origen
type Vector2 = { x: number; y: number };

function rotatePoint(point: Vector2, angle: number): Vector2
{
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return {
		x: point.x * cos - point.y * sin,
		y: point.x * sin + point.y * cos,
	};
}

export function circleVsOBB(circle: Ball, player: Player): boolean
{

  // 1. Trasladar el círculo al espacio local del OBB
	const localCirclePos: Vector2 = 
	{
		x: circle.position.x - player.position.x,
		y: circle.position.y - player.position.y,
	};

	// 2. Rotar el círculo en sentido contrario a la rotación del OBB para desrotar el OBB
	const unrotatedCircle = rotatePoint(localCirclePos, -player.rotation);

	// 3. Calcular el punto más cercano en el AABB (que es ahora el OBB desrotado)
	const closestX = Math.max(-(player.size.height / 2), Math.min(unrotatedCircle.x, (player.size.height / 2)));
	const closestY = Math.max(-(player.size.width / 2), Math.min(unrotatedCircle.y, (player.size.width / 2)));

	// 4. Calcular la distancia entre el centro desrotado y el punto más cercano
	const dx = unrotatedCircle.x - closestX;
	const dy = unrotatedCircle.y - closestY;

	// 5. Verificar si la distancia es menor o igual al radio del círculo
	return (dx * dx + dy * dy) <= (circle.radius * circle.radius);
}