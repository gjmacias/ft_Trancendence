import { Wall } from './Field';
import { Vector3 } from './Vector3';
import { PowerUp } from "./PowerUp";

export type PlayerRole = "human" | "ai" | "block";

export class Player {
  fd: number;
  id: string;
  nickname: string;
  elo: number;
  role: PlayerRole;
  position: Vector3;
  size: {
    width: number;
    height: number;
    depth: number;
  };
  rotation: number;
  speed: number;
  moving: number;
  score: number;
  isActive: boolean;
  isReady: boolean;
  isDeath: boolean;
  powerUps: PowerUp[];
  color: string;
  percentage: number;
	timestamp: number;

  get playerId(): string {
    return this.id;
  }

  get playerRole(): PlayerRole {
    return this.role;
  }

  get playerNick(): string {
    return this.nickname;
  }

  get isHuman(): boolean {
    return this.role === "human";
  }

  get isAI(): boolean {
    return this.role === "ai";
  }

  get isBlock(): boolean {
    return this.role === "block";
  }

  get hasPowerUps(): boolean {
    return this.powerUps && this.powerUps.length > 0;
  }
}
