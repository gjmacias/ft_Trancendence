import { Player } from './Player';
import { Vector3 } from './Vector3';
import { Point } from './Point';

export type WallRole = "normal" | "playerIn" | "bounce";

export class Wall {
  id: number;
  start: Point;
  end: Point;
  role: WallRole;
  friction: number;
  color: string;
  players: Player[];

  get length(): number {
    const dx = this.end.position.x - this.start.position.x;
    const dy = this.end.position.y - this.start.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  get center(): { x: number; y: number } {
    return {
      x: (this.start.position.x + this.end.position.x) / 2,
      y: (this.start.position.y + this.end.position.y) / 2
    };
  }
}

export class Field {
  id: number;
  walls: Wall[];
  points: Point[];

  get wallCount(): number {
    return this.walls.length;
  }
}
