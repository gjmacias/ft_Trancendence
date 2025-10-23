import { Ball } from "../../entities/Ball";
import { Wall } from "../../entities/Field";

export function CircleVsLineSegment(ball: Ball, wall: Wall): boolean {
	// Vector del segmento
	const dx = wall.end.position.x - wall.start.position.x;
	const dy = wall.end.position.y - wall.start.position.y;

	// Vector del punto inicial del segmento al centro del círculo
	const fx = ball.position.x - wall.start.position.x;
	const fy = ball.position.y - wall.start.position.y;

	// Proyección escalar (t) del punto sobre el segmento
	const lenSq = dx * dx + dy * dy;
	let t = (fx * dx + fy * dy) / lenSq;

	// Limitar t al rango [0, 1] para que esté dentro del segmento
	t = Math.max(0, Math.min(1, t));

	// Punto más cercano en el segmento al círculo
	const closestX = wall.start.position.x + t * dx;
	const closestY = wall.start.position.y + t * dy;

	// Vector del círculo al punto más cercano
	const distX = ball.position.x - closestX;
	const distY = ball.position.y - closestY;

	// Distancia al cuadrado y comparación con el radio
	return (distX * distX + distY * distY) <= (ball.radius * ball.radius);
}
