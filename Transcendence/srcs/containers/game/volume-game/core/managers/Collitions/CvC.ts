import { Ball } from "../../entities/Ball";

export function circleVsCircle(c1: Ball, c2: Ball): boolean {
	const dx = c1.position.x - c2.position.x;
	const dy = c1.position.y - c2.position.y;
	const distance = Math.sqrt(dx * dx + dy * dy);
	return distance < c1.radius + c2.radius;
}