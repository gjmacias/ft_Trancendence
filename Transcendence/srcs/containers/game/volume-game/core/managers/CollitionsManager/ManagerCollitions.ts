// ManagerCollisions.ts
import { Ball } from "../../entities/Ball";
import { Player } from "../../entities/Player";
import { GameState } from "../../entities/GameState";
import { circleVsCircle } from "../Collitions/CvC";
import { circleVsOBB } from "../Collitions/CvOBB";
import { CircleVsLineSegment } from "../Collitions/CvsLine";
import { Field } from "../../entities/Field";
import { hitBallAndBall, hitBallAndPowerUp, hitBallAndPlayer, hitBallAndWall, hitBallToWallScore1v1, hitBallToWallScoreTeams } from "../hitsManager/HitManagerBalls";

export async function ManagerCollisionsBallvBall(viewBall : Ball, balls : Ball[], gameState :GameState) : Promise <void>
{
	for (const affectedBall of balls)
	{
		if (viewBall.id  == affectedBall.id)
			continue;
		if (circleVsCircle(viewBall, affectedBall))
		{
			if(viewBall.role === "ball" && viewBall.isActive && affectedBall.role === "ball")
				await hitBallAndBall(viewBall, affectedBall);
			else if (viewBall.role === "ball" && affectedBall.role === "powerup")
				hitBallAndPowerUp(viewBall, affectedBall, gameState);
			else
				continue;
		}
	}
}

export function ManagerCollisionsBallvPlayer(ball : Ball, players : Player[])
{
	for (const player of players)
	{
		const hit = circleVsOBB(ball, player)
		if (hit)
		{		
			if (ball.role === "ball" && ball.isActive && (player.role === "human" || player.role === "ai"))
				hitBallAndPlayer(ball, player);
			else
				continue;
		}
	}
}

export function ManagerCollisionsBallvField(ball : Ball, field : Field, gameState :GameState)
{
	for (const wall of field.walls)
	{
		if (CircleVsLineSegment(ball, wall))
		{
			if (ball.role === "ball" && wall.role === "normal")
				hitBallAndWall(ball, wall);
			else if (ball.role === "ball" && wall.role === "playerIn" && gameState.configuration.type === "1v1")
				hitBallToWallScore1v1(wall.players[0], gameState);
			else if (ball.role === "ball" && wall.role === "playerIn" && gameState.configuration.type === "teams")
				hitBallToWallScoreTeams(wall, gameState);
			else
				continue;
		}
	}
}