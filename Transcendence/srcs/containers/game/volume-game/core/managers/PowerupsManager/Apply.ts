import { Ball } from "../../entities/Ball";
import { GameState } from "../../entities/GameState";
import { Player } from "../../entities/Player";
import { PowerUp } from "../../entities/PowerUp";
import {
    POWERUP_SPEED_MULTIPLIER, POWERUP_SIZE_MULTIPLIER, POWERUP_SLOW_MULTIPLIER
} from '../../Constants/ConstPowerUp';

/**
 * Función auxiliar para aplicar efectos de power-ups recogidos
 */
export function applyPowerUpEffect(
    powerUp: Ball, 
    ball: Ball, 
    gameState: GameState
): void {
    if (powerUp.role === "powerup") {
        ball.ballSpeed *= POWERUP_SPEED_MULTIPLIER;
    }
}

/**
 * Aplica power-up de un jugador usando el enum PowerUpEffect
 */
export function applyPlayerPowerUp(player: Player, powerUpIndex: number, gameState: GameState): void {
    if (!player.powerUps || player.powerUps.length <= powerUpIndex) return;
    
    const powerUp = player.powerUps[powerUpIndex];
    if (!powerUp.isActive || powerUp.isExpired) return;
    
    
      applyBallEffects(powerUp.effect, gameState);
      applyPlayerEffects(powerUp.effect, player);
      applyEnemyEffects(powerUp.effect, player, gameState);
      applyInstantEffects(powerUp.effect, gameState);
    // Remover si es instantáneo
    if (powerUp.isInstant) {
        player.powerUps.splice(powerUpIndex, 1);
    }
}

/**
 * Revierte los efectos de un power-up cuando expira
 */
export function revertPowerUpEffect(player: Player, powerUpIndex: number, gameState: GameState): void {
    if (!player.powerUps || player.powerUps.length <= powerUpIndex) return;
    
    const powerUp = player.powerUps[powerUpIndex];
    if (!powerUp.isActive || powerUp.isExpired) return;

      revertBallEffects(powerUp.effect, gameState); 
      revertPlayerEffects(powerUp.effect, player);
      revertEnemyEffects(powerUp.effect, player, gameState);
}

// ===================
// EFECTOS EN BOLAS
// ===================

function applyBallEffects(effect: string, gameState: GameState): void {
    Object.values(gameState.balls).forEach(ball => {
        switch (effect) {
            case "speedUpBall":
                ball.ballSpeed *= POWERUP_SPEED_MULTIPLIER;
                break;
            case "speedDownBall":
                ball.ballSpeed *= POWERUP_SLOW_MULTIPLIER;
                break;
        }
    });
}

function revertBallEffects(effect: string, gameState: GameState): void {
    Object.values(gameState.balls).forEach(ball => {
        switch (effect) {
            case "speedUpBall":
                ball.ballSpeed /= POWERUP_SPEED_MULTIPLIER;
                break;
            case "speedDownBall":
                ball.ballSpeed /= POWERUP_SLOW_MULTIPLIER;
                break;
        }
    });
}

// ===================
// EFECTOS EN JUGADOR
// ===================

function applyPlayerEffects(effect: string, player: Player): void {
    switch (effect) {
        case "sizeUpMe":
            player.size.height *= POWERUP_SIZE_MULTIPLIER;
            player.size.width *= POWERUP_SIZE_MULTIPLIER;
            break;
        case "speedUpMe":
            player.speed *= POWERUP_SPEED_MULTIPLIER;
            break;
    }
}

function revertPlayerEffects(effect: string, player: Player): void {
    switch (effect) {
        case "sizeUpMe":
            player.size.height /= POWERUP_SIZE_MULTIPLIER;
            player.size.width /= POWERUP_SIZE_MULTIPLIER;
            break;
        case "speedUpMe":
            player.speed /= POWERUP_SPEED_MULTIPLIER;
            break;
    }
}

// ===================
// EFECTOS EN ENEMIGOS
// ===================


function applyEnemyEffects(effect: string, activatingPlayer: Player, gameState: GameState): void {
    Object.values(gameState.players).forEach(player => {
        if (player.id === activatingPlayer.id) return; // Skip al jugador que activó
        
        switch (effect) {
            case "sizeDownEnemy":
                player.size.height *= POWERUP_SLOW_MULTIPLIER;
                player.size.width *= POWERUP_SLOW_MULTIPLIER;
                break;
            case "freezeEnemy":
                player.moving = 0;
                break;
            case "invertControlsEnemy":
                // Se maneja en input handler
                //`Player ${activatingPlayer.id} inverted enemy ${player.id} controls`);
                break;
        }
    });
}

function revertEnemyEffects(effect: string, activatingPlayer: Player, gameState: GameState): void {
    Object.values(gameState.players).forEach(player => {
        if (player.id === activatingPlayer.id) return; // Skip al jugador que activó
        
        switch (effect) {
            case "sizeDownEnemy":
                player.size.height /= POWERUP_SLOW_MULTIPLIER;
                player.size.width /= POWERUP_SLOW_MULTIPLIER;
                break;
            case "freezeEnemy":
                // Se libera automáticamente
                break;
            case "invertControlsEnemy":
                // Se maneja en input handler
                //`Player ${activatingPlayer.id} controls restored for enemy ${player.id}`);
                break;
        }
    });
}

// ===================
// EFECTOS INSTANTÁNEOS
// ===================

function applyInstantEffects(effect: string, gameState: GameState): void {
    switch (effect) {
        case "MultiplyBall":
            // Implementar creación de nueva bola
            break;
    }
}
