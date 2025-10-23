import { Player } from "../../entities/Player";
import { GameState } from "../../entities/GameState";
import { PowerUpEffect, createPowerUp } from "../../entities/PowerUp";
import { applyPlayerPowerUp, revertPowerUpEffect } from "./Apply";

/**
 * Aplica hasta 3 efectos simultáneos a un jugador
 * Reutiliza toda la lógica existente de Apply.ts
 */
export function applyMultipleEffects(
    player: Player, 
    effects: PowerUpEffect[], 
    gameState: GameState
): boolean {
    // Validar que no se pasen más de 3 efectos
    if (effects.length === 0 || effects.length > 3) {
        console.warn(`Invalid number of effects: ${effects.length}. Must be 1-3`);
        return false;
    }

    // Validar que el jugador pueda recibir power-ups
    if (!player.powerUps) {
        player.powerUps = [];
    }

    console.log(`Applying ${effects.length} effects to player ${player.id}:`, effects);

    // Crear y aplicar cada efecto usando las funciones existentes
    effects.forEach((effect, index) => {
        // Crear power-up temporal con ID único
        const powerUpId = Date.now() + index;
        const powerUp = createPowerUp(powerUpId, effect);
        
        // Agregar al jugador
        player.powerUps.push(powerUp);
        
        // Aplicar inmediatamente usando la función existente
        const powerUpIndex = player.powerUps.length - 1;
        applyPlayerPowerUp(player, powerUpIndex, gameState);
        
        console.log(`Applied effect ${effect} to player ${player.id}`);
    });

    return true;
}

/**
 * Revierte hasta 3 efectos específicos de un jugador
 * Reutiliza la lógica de reversión existente
 */
export function revertMultipleEffects(
    player: Player, 
    effects: PowerUpEffect[], 
    gameState: GameState
): boolean {
    if (!player.powerUps || effects.length === 0 || effects.length > 3) {
        return false;
    }

    console.log(`Reverting ${effects.length} effects from player ${player.id}:`, effects);

    // Buscar y revertir cada efecto desde el final del array
    effects.forEach(effect => {
        for (let i = player.powerUps.length - 1; i >= 0; i--) {
            const powerUp = player.powerUps[i];
            
            if (powerUp.effect === effect && powerUp.isActive) {
                // Revertir usando función existente
                revertPowerUpEffect(player, i, gameState);
                
                // Remover del array
                player.powerUps.splice(i, 1);
                
                console.log(`Reverted effect ${effect} from player ${player.id}`);
                break; // Solo revertir el primero encontrado
            }
        }
    });

    return true;
}

/**
 * Aplica combo predefinidos de 2-3 efectos
 */
export function applyEffectCombo(
    player: Player, 
    comboType: "offensive" | "defensive" | "chaos", 
    gameState: GameState
): boolean {
    let effects: PowerUpEffect[];

    switch (comboType) {
        case "offensive":
            effects = ["speedUpBall", "sizeUpMe", "sizeDownEnemy"];
            break;
        case "defensive":
            effects = ["speedUpMe", "sizeUpMe"];
            break;
        case "chaos":
            effects = ["MultiplyBall", "freezeEnemy", "invertControlsEnemy"];
            break;
        default:
            console.warn(`Unknown combo type: ${comboType}`);
            return false;
    }

    return applyMultipleEffects(player, effects, gameState);
}

/**
 * Función helper para aplicar efectos aleatorios
 */
export function applyRandomEffects(
    player: Player, 
    count: 1 | 2 | 3, 
    gameState: GameState
): boolean {
    const allEffects: PowerUpEffect[] = [
        "speedUpBall", "speedDownBall", "MultiplyBall",
        "sizeUpMe", "speedUpMe", "sizeDownEnemy", 
        "freezeEnemy", "invertControlsEnemy"
    ];

    // Seleccionar efectos aleatorios sin repetir
    const selectedEffects: PowerUpEffect[] = [];
    const availableEffects = [...allEffects];

    for (let i = 0; i < count && availableEffects.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableEffects.length);
        selectedEffects.push(availableEffects[randomIndex]);
        availableEffects.splice(randomIndex, 1); // Evitar duplicados
    }

    return applyMultipleEffects(player, selectedEffects, gameState);
}

/**
 * Limpia todos los efectos activos de un jugador
 */
export function clearAllEffects(player: Player, gameState: GameState): boolean {
    if (!player.powerUps || player.powerUps.length === 0) {
        return false;
    }

    const activeEffects = player.powerUps
        .filter(p => p.isActive && !p.isInstant)
        .map(p => p.effect);

    return revertMultipleEffects(player, activeEffects, gameState);
}