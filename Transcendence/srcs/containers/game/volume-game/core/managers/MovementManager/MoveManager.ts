import {GameState} from "../../entities/GameState"
import { MoveBall } from "./MovementBalls"
import { MoveEveryWallPlayer } from "./MovementPlayer";

export function ManagerMovement(gameState : GameState)
{
	for (const ball of gameState.balls)
	{
		MoveBall(ball);
	}
	for (const WallWithPlayers of gameState.field.walls)
	{
		if (WallWithPlayers.role === "playerIn")
		{
			MoveEveryWallPlayer(WallWithPlayers);		
		}
	}
}