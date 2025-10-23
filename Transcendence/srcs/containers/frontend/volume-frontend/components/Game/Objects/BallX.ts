import { Mesh, MeshBuilder, Scene, Vector3, StandardMaterial, Color3, GlowLayer, Light } from '@babylonjs/core';
import { PointLight } from '@babylonjs/core';
import { Ball } from '../Models/Ball';

type Position = {
  x: number;
  y: number;
  z: number;
};

export class BallX {
  private mesh: Mesh;
  private material: StandardMaterial;
  private id: number;
  private position: Vector3;
  private radius: number;
  private color: string;
  private scene: Scene;

  private innerLight: Light;

  private POSITION_DEFAULT: Vector3 = new Vector3(0, 0, 0);
  private RADIUS_DEFAULT: number = 1;
  private COLOR_DEFAULT: string = '#FFFFFF';

  constructor(scene: Scene, ball: Ball) {
    this.scene = scene;
    this.id = ball.id;
    if (ball.position !== undefined) {
      this.position = new Vector3(
        ball.position.x,
        ball.position.y,
        ball.position.z
      );
    } else {
      this.position = this.POSITION_DEFAULT;
    }
    this.radius = ball.radius || this.RADIUS_DEFAULT;
    this.color = ball.color || this.COLOR_DEFAULT;
    this.initialiseMesh();
    this.initialiseMaterial();
    this.initialiseInnerLight();
  }

  private initialiseMesh(): void {
    this.mesh = MeshBuilder.CreateSphere(
      `ball-${this.id}`,
      {
        diameter: this.radius * 2,
        segments: 16
      },
      this.scene
    );
    this.mesh.position = this.position;
  }

  private initialiseMaterial(): void {
    this.material = new StandardMaterial(`ball-mat-${this.id}`, this.scene);
    this.material.diffuseColor = Color3.FromHexString(this.color);
    this.material.emissiveColor = Color3.FromHexString(this.color);
    this.mesh.material = this.material;
  }

  private initialiseInnerLight(): void {
    const light = new PointLight(
      `ball-light-${this.id}`,
      new Vector3(0, 0, 0),
      this.scene
    );
    light.position = this.position;
    light.intensity = 1;
    this.innerLight = light;
  }

  public update(ball: Ball): void {
    if (ball.position) {
      this.updatePosition(ball.position);
    }
    if (ball.radius !== undefined) {
      this.updateRadius(ball.radius);
    }
    if (ball.color) {
      this.updateColor(ball.color);
    }
  }

  public updatePosition(newPosition: Position): void {
    if (newPosition.x === this.position.x &&
      newPosition.y === this.position.y &&
      newPosition.z === this.position.z) {
      return;
    }
    this.position.x = newPosition.x;
    this.position.y = newPosition.y;
    this.position.z = newPosition.z;
    this.setPosition();
  }

  public updateRadius(newRadius: number): void {
    if (newRadius === this.radius) {
      return;
    }
    this.radius = newRadius;
    this.setRadius();
  }

  public updateColor(newColor: string): void {
    if (newColor === this.color) {
      return;
    }
    this.color = newColor;
    this.setColor();
  }

  private setPosition(): void {
    if (!this.mesh) return;
    this.mesh.position.x = this.position.x;
    this.mesh.position.y = this.position.y;
    this.mesh.position.z = this.position.z;
    this.innerLight.position = this.mesh.position;
  }

  private setRadius(): void {
    if (!this.mesh) return;
    this.mesh.scaling.x = this.radius;
    this.mesh.scaling.y = this.radius;
    this.mesh.scaling.z = this.radius;
  }

  private setColor(): void {
    if (!this.material) return;
    this.mesh.material = this.material;
  }

  public getMesh(): Mesh {
    return this.mesh;
  }

  public getId(): number {
    return this.id;
  }

  public getPosition(): Vector3 {
    return this.position;
  }

  public getRadius(): number {
    return this.radius;
  }

  public getColor(): string {
    return this.color;
  }

  public dispose(): void {
    if (this.mesh) {
      this.mesh.dispose();
    }
    if (this.material) {
      this.material.dispose();
    }
  }
}
