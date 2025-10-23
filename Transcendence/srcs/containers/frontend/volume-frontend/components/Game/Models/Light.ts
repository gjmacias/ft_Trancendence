export type LightType = "directional" | "point" | "spot" | "hemispheric";

export class Light {
  id: string;
  type: LightType;
  color: string;
  intensity: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  direction: {
    x: number;
    y: number;
    z: number;
  };
  targetId: string;
  angle: number;
  range: number;

  get isDirectional(): boolean {
    return this.type === "directional";
  }

  get isPoint(): boolean {
    return this.type === "point";
  }

  get isSpot(): boolean {
    return this.type === "spot";
  }

  get isHemispheric(): boolean {
    return this.type === "hemispheric";
  }
}
