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
  duration: number;
  targetPlayerId: string;
  isActive: boolean;
  appliedAt: number;

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
    if (this.duration === 0 || this.appliedAt === 0) return false;
    const elapsed = (Date.now() - this.appliedAt) / 1000;
    return elapsed >= this.duration;
  }
  get remainingTime(): number {
    if (this.duration === 0) return 0;
    const elapsed = (Date.now() - this.appliedAt) / 1000;
    return Math.max(0, this.duration - elapsed);
  }
}
