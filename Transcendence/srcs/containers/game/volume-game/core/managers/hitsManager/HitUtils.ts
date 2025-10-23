import { Vector3 } from "../../entities/Vector3";

export function closestPointOnLine(a: Vector3, b: Vector3, p: Vector3): Vector3 
{
	const ab = { x: b.x - a.x, y: b.y - a.y };
	const abLengthSquared = ab.x * ab.x + ab.y * ab.y;
	const ap = { x: p.x - a.x, y: p.y - a.y };
	const t = Math.max(0, Math.min(1, (ap.x * ab.x + ap.y * ab.y) / abLengthSquared));
	return {
		x: a.x + ab.x * t,
		y: a.y + ab.y * t,
		z: 0
	};
}
