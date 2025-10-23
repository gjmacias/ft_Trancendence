import { FIELD_CONSTANT_BOUNCE } from "../../Constants/ConstFieldWall";
import { INPUTS_DELAY } from "../../Constants/Constants";
import { PLAYER_MAX_SPEED } from "../../Constants/ConstPlayer";
import { Wall } from "../../entities/Field";
import { Player } from "../../entities/Player";
import { calculateWallAngle } from "../../entities/Utils";

export function MoveEveryWallPlayer( wall : Wall) : void
{
	for (const player of wall.players)
		MovePlayer(player, wall);
}

function MovePlayer(player: Player, wall: Wall)
{
	GetMomentum(player, wall);
	const dx = wall.end.position.x - wall.start.position.x;
	const dy = wall.end.position.y - wall.start.position.y;
	const distance = Math.sqrt(dx * dx + dy * dy);

	const minPercent = ((player.size.height / 2) / distance);
	const maxPercent = 1 - minPercent;
	const percentDelta = (player.speed * wall.friction) / distance;

	let newPercent = player.percentage + percentDelta;
	
	if (newPercent > maxPercent)
	{	
		newPercent = maxPercent;
		if (player.speed > 0)
			player.speed = -(player.speed) * FIELD_CONSTANT_BOUNCE;
	}
	else if (newPercent < minPercent)
	{	
		newPercent = minPercent;
		if (player.speed < 0)
			player.speed = -(player.speed) * FIELD_CONSTANT_BOUNCE;
	}
	player.percentage = newPercent;
	
	player.position.x = wall.start.position.x + (dx * newPercent);
	player.position.y = wall.start.position.y + (dy * newPercent);

	player.rotation = calculateWallAngle(wall);
}

function GetMomentum(player : Player, wall :Wall)
{
	if (player.moving === 0)
	{
		player.speed = player.speed * wall.friction;
		return;
	}
	if (player.moving > 0)
	{
		if (player.speed < PLAYER_MAX_SPEED)
			player.speed += (PLAYER_MAX_SPEED / INPUTS_DELAY);
		else
			player.speed = PLAYER_MAX_SPEED;
	}
	else
	{
		if (player.speed > -PLAYER_MAX_SPEED)
			player.speed -= (PLAYER_MAX_SPEED / INPUTS_DELAY);
		else
			player.speed = -PLAYER_MAX_SPEED;	
	}
}