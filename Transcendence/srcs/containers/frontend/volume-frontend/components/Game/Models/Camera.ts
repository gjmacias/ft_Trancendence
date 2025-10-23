export class Camera {
  id: string;
  type: "orthographic" | "perspective";
  position: {
    x: number;
    y: number;
    z: number;
  };
  target: {
    x: number;
    y: number;
    z: number;
  };
  fov: number;
  orthographicSize: {
    width: number;
    height: number;
  };
  isActive: boolean;
  minZoom: number;
  maxZoom: number;
  controlsEnabled?: boolean;
}
