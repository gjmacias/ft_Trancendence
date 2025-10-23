import { GameState } from "../entities/GameState";
import { InputEvent } from './inputQueue';
import { ManagePowerUPPlayer } from "../managers/PowerupsManager/PowerUpManagement"

export async function processInputsGame(inputs : InputEvent[], gameState : GameState)
{
	for (const input of inputs)
	{
		const player = gameState.players.find(p => p.id === input.playerId);
		if (!player || !player.isActive) continue;

		inputsMovePlayers(input, gameState);
		inputsPowerups(input, gameState);
		inputsControls(input, gameState);
		// inputsMultiPowerups(input, gameState);
	}
}

function inputsMovePlayers(input : InputEvent, gameState : GameState)
{
	let player = gameState.players.find(p => p.id === input.playerId);
	if (!player || !player.isActive) return;

	switch (input.command) 
	{
		case "startGoUp":
			player.moving = 1;
			break;
		case "stopGoUp":
			player.moving = 0;
			break;
		case "startGoDown":
			player.moving = -1;
			break;
		case "stopGoDown":
			player.moving = 0;
			break;
	}
	if (gameState.configuration.type === "1v1" 
		&& gameState.configuration.cloudConection === false 
		&& gameState.configuration.hasBots === false)
	{
		player = gameState.players.find(p => p.id !== input.playerId);
		if (!player || !player.isActive) return;

		switch (input.command) 
		{
			case "startGoUpPlayer2":
				player.moving = -1;
				break;
			case "stopGoUpPlayer2":
				player.moving = 0;
				break;
			case "startGoDownPlayer2":
				player.moving = 1;
				break;
			case "stopGoDownPlayer2":
				player.moving = 0;
				break;
		}
	}
}


function inputsPowerups(input : InputEvent, gameState : GameState)
{
	if (gameState.configuration.havePowerUps === false) return;

	let player = gameState.players.find(p => p.id === input.playerId);
	if (!player || !player.isActive) return;

	switch (input.command) 
	{
	case "powerUp1":
		ManagePowerUPPlayer(player, 0, gameState);
		break;				
	case "powerUp2":
		ManagePowerUPPlayer(player, 1, gameState);
		break;				
	case "powerUp3":
		ManagePowerUPPlayer(player, 2, gameState);
		break;
	}
	if (gameState.configuration.type === "1v1" 
		&& gameState.configuration.cloudConection === false 
		&& gameState.configuration.hasBots === false)
	{
		player = gameState.players.find(p => p.id !== input.playerId);
		if (!player || !player.isActive) return;

		switch (input.command) 
		{
			case "powerUp1Player2":
				ManagePowerUPPlayer(player, 0, gameState);
				break;				
			case "powerUp2Player2":
				ManagePowerUPPlayer(player, 1, gameState);
				break;				
			case "powerUp3Player2":
				ManagePowerUPPlayer(player, 2, gameState);
				break;
		}
	}
}

function inputsControls(input : InputEvent, gameState : GameState)
{
	let player = gameState.players.find(p => p.id === input.playerId);
	if (!player || !player.isActive) return;

	switch (input.command) 
	{
		case "imReady":
			if (gameState.status !== "waiting")
				return;
			player.isReady = true;
	}
	if (gameState.configuration.type === "1v1" 
		&& gameState.configuration.cloudConection === false 
		&& gameState.configuration.hasBots === false)
	{
		player = gameState.players.find(p => p.id !== input.playerId);
		if (!player || !player.isActive) return;

		switch (input.command) 
		{
			case "imReady":
				if (gameState.status !== "waiting")
					return;
				player.isReady = true;
		}
	}
}

// function inputsMultiPowerups(input: InputEvent, gameState: GameState) {
//     if (gameState.configuration.havePowerUps === false) return;

//     let player = gameState.players.find(p => p.id === input.playerId);
//     if (!player || !player.isActive) return;

//     switch (input.command) {
//         case "comboOffensive":
//             applyEffectCombo(player, "offensive", gameState);
//             console.log(`${player.id} triggered offensive combo`);
//             break;
//         case "comboDefensive":
//             applyEffectCombo(player, "defensive", gameState);
//             console.log(`${player.id} triggered defensive combo`);
//             break;
//         case "comboChaos":
//             applyEffectCombo(player, "chaos", gameState);
//             console.log(`${player.id} triggered chaos combo`);
//             break;
//     }
// }