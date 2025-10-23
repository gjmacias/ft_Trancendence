import { ONE_SECOND } from "../../Constants/Constants";
import { GameState } from "../../entities/GameState";
import { Vector3 } from "../../entities/Vector3";
import { updatePlayerAI } from "./AIController";
import { goToSetpoint, updatePlayerAI2 } from "./AIController2";

export function ManagerAIs(gameState: GameState)
{
	// 👉 Mover jugadores IA primero
	for (const player of gameState.players)
	{
		if (player.role === "ai")
		{
			const SnapchotTime = Date.now() - player.timestamp
			if( SnapchotTime < ONE_SECOND)
			{
				// if( SnapchotTime > ONE_SECOND / 2)
				// {
				// 	player.moving = 0;
				// }
				goToSetpoint(player);
				return;
			}	
			player.timestamp = Date.now();
			let mainBall;
			let minDistanceToBall = 0;
			for (const ball of gameState.balls)
			{
				if (ball.role === "ball")
				{
					const distanceToBall = Distance(ball.position, player.position);
					if (minDistanceToBall === 0 || distanceToBall < minDistanceToBall)
					{
						minDistanceToBall = distanceToBall;
						mainBall = ball;
					}
				}
			}
			//updatePlayerAI(player, mainBall);
			updatePlayerAI2(player, mainBall!);
		}
	}
}

function Distance(a: Vector3, b: Vector3): number 
{
    return Math.sqrt(
        Math.pow(b.x - a.x, 2) +
        Math.pow(b.y - a.y, 2) +
        Math.pow(b.z - a.z, 2)
    );
}
