import { Ball } from "../../entities/Ball";

export function MoveBall(ball : Ball) : void
{
	if (!ball.isActive || ball.ballSpeed <= 0)
		return;

	ball.position.x += ball.direction.x * ball.ballSpeed;
	ball.position.y += ball.direction.y * ball.ballSpeed;
	ball.position.z += ball.direction.z * ball.ballSpeed;
}