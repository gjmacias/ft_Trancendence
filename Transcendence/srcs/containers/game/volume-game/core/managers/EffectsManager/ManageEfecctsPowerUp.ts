import { Player } from "../../entities/Player";
import { GameState } from "../../entities/GameState";
import { revertPowerUpEffect } from "../../managers/PowerupsManager/Apply";

export function ManagePowerUpEffects(players : Player[], gameState: GameState) : void
{
	for (const player of players) {
		if (player.role !== "human" && player.role !== "ai")
			continue;

		if (!player.powerUps) continue;

        // Iterar desde el final para poder remover elementos
        for (let i = player.powerUps.length - 1; i >= 0; i--) 
		{
            const powerUp = player.powerUps[i];

            if (!powerUp.isActive)
                continue;

            if (powerUp.isInstant) {
                player.powerUps = player.powerUps.filter(p => !p.isInstant || p.isActive);
                continue;
            }

            if (powerUp.isExpired) {
                // Aquí aplicamos la reversión antes de remover
                revertPowerUpEffect(player, i, gameState);

                // Remover power-up expirado
                player.powerUps.splice(i, 1);
            }
		}
	}
}
