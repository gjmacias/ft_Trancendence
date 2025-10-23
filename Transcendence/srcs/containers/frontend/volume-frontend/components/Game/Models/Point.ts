import { Vector3 } from "./Vector3";

export class Point
{
  id: number;
  position: Vector3;
  constructor()
  {
    this.position = new Vector3();
  }

  public getAsVector3(): Vector3 {
    return this.position;
  }
  public getAsVector2(): { x: number; y: number } {
    return { x: this.position.x, y: this.position.y };
  }
  public getPlain(): [ x: number, y: number, z: number ] {
    return [this.position.x, this.position.y, this.position.z];
  }

  get x(): number {
    return this.position.x;
  }
  get y(): number {
    return this.position.y;
  }
  get z(): number {
    return this.position.z;
  }
}
