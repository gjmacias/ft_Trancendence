import { Player } from "../../entities/Player";
import { GameState } from "../../entities/GameState";
import { applyPlayerPowerUp } from "./Apply";
import { applyMultipleEffects } from "./MultiEffectManager";
import { PowerUpEffect } from "../../entities/PowerUp";

export function ManagePowerUPPlayer(player: Player, powerUpIndex: number, gameState: GameState): void {
    applyPlayerPowerUp(player, powerUpIndex, gameState);
}

// Nueva función para múltiples efectos
export function ManageMultiPowerUPPlayer(
    player: Player, 
    effects: PowerUpEffect[], 
    gameState: GameState
): void {
    applyMultipleEffects(player, effects, gameState);
}