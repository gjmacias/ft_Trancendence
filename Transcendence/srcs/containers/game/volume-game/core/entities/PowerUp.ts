import {
    POWERUP_DEFAULT_DURATION, POWERUP_SPEEDUP_DURATION, POWERUP_SIZE_DURATION,
    POWERUP_FREEZE_DURATION,
    POWERUP_INVERT_DURATION, POWERUP_MULTIBALL_DURATION,
    POWERUP_SPEEDOWN_DURATION
} from '../Constants/ConstPowerUp';

export type PowerUpEffect =
  | "speedUpBall"
  | "speedDownBall"
  | "MultiplyBall"
  | "sizeUpMe"
  | "speedUpMe"
  | "sizeDownEnemy"
  | "invertControlsEnemy"
  | "freezeEnemy";

export class PowerUp {
  id: number;
  effect: PowerUpEffect;
  duration: number; // en segundos (0 si es instantáneo)
  targetPlayerId: string; // opcional, se asigna al aplicar
  isActive: boolean;
  appliedAt: number; // timestamp opcional para trackear duración
  // Getters básicos
    get powerUpId(): number {
        return this.id;
    }

    get powerUpEffect(): PowerUpEffect {
        return this.effect;
    }

    get isInstant(): boolean {
        return this.duration === 0;
    }

    get isExpired(): boolean {
        if (this.duration === 0 || this.appliedAt === 0) return false; // Instantáneos no expiran
        const elapsed = (Date.now() - this.appliedAt) / 1000;
        return elapsed >= this.duration;
    }

    get remainingTime(): number {
        if (this.duration === 0) return 0;
        const elapsed = (Date.now() - this.appliedAt) / 1000;
        return Math.max(0, this.duration - elapsed);
    }
}
// Factory function simplificada
export function createPowerUp(id: number, effect: PowerUpEffect): PowerUp {
    const powerUp = new PowerUp();
    powerUp.id = id;
    powerUp.effect = effect;
    powerUp.targetPlayerId = "";
    powerUp.isActive = true;
    powerUp.appliedAt = 0;
    
    // Asignar duración según el efecto
    switch (effect) {
        case "speedUpBall":
            powerUp.duration = POWERUP_SPEEDUP_DURATION;
            break;
        case "speedDownBall":
            powerUp.duration = POWERUP_SPEEDOWN_DURATION; // No hay duración específica
            break;
        case "MultiplyBall":
            powerUp.duration = POWERUP_MULTIBALL_DURATION; // Instantáneo
            break;
        case "sizeUpMe":
            powerUp.duration = POWERUP_SIZE_DURATION;
            break;
        case "speedUpMe":
            powerUp.duration = POWERUP_SPEEDUP_DURATION;
            break;
        case "sizeDownEnemy":
            powerUp.duration = POWERUP_SIZE_DURATION;
            break;
        case "freezeEnemy":
            powerUp.duration = POWERUP_FREEZE_DURATION;
            break;
        case "invertControlsEnemy":
            powerUp.duration = POWERUP_INVERT_DURATION;
            break;
        default:
            powerUp.duration = POWERUP_DEFAULT_DURATION;
    }
    
    return powerUp;
}
