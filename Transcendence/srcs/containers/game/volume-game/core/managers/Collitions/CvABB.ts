import { Ball } from "../../entities/Ball";
import { Player } from "../../entities/Player";

export function circleVsAABB(circle: Ball, box: Player): boolean {
	// Encuentra el punto más cercano en el AABB al centro del círculo
	const closestX = Math.max(box.position.x, Math.min(circle.position.x, box.position.x + box.size.height));
	const closestY = Math.max(box.position.y, Math.min(circle.position.y, box.position.y + box.size.width));

	// Calcula la distancia entre el centro del círculo y ese punto
	const dx = circle.position.x - closestX;
	const dy = circle.position.y - closestY;

	// Si la distancia es menor o igual al radio, hay colisión
	return (dx * dx + dy * dy) <= (circle.radius * circle.radius);
}