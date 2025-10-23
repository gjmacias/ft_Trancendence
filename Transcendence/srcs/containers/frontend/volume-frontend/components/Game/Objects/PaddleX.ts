import { Mesh, MeshBuilder, Scene, Vector3, StandardMaterial, Color3, GlowLayer } from '@babylonjs/core';
import { Player } from '../Models/Player';
import Logger from '@utils/Logger';

type Dimensions = {
  width: number;
  height: number;
  depth: number;
}

type Position = {
  x: number;
  y: number;
  z: number;
};

type PaddleConstructorArgs = {
  nickname: string;
  dimensions?: Dimensions;
  position?: Position;
  rotation?: number;
};

export class PaddleX {
  private mesh: Mesh;
  private nickname: string;
  private dimensions: Vector3;
  private position: Vector3;
  private rotation: number;
  private color: string;
  private scene: Scene;

  private DIMENSIONS_DEFAULT: Vector3 = new Vector3(1, 4, 1);
  private POSITION_DEFAULT: Vector3 = new Vector3(0, 0, 0);
  private ROTATION_DEFAULT: number = 0;

  constructor(scene: Scene, player: Player) {
    this.scene = scene;
    this.initWithPlayer(player);
    this.initialiseMesh();
  }

  private logEnabled: boolean = false;

  private log(...args: any[]) {
    if (!this.logEnabled) return;
    Logger.log(`[PaddleX]`, ...args);
  }

  private initWithPlayer(player: Player): void {
    this.nickname = player.nickname || 'Player';
    this.log('Initializing paddle for player:', this.nickname);
    this.dimensions = new Vector3(
      player.size.height,
      player.size.width,
      player.size.depth
    );
    this.position = new Vector3(
      player.position.x,
      player.position.y,
      player.position.z
    );
    this.rotation = player.rotation;
    this.color = player.color;
  }

  private initialiseMesh(): void {
    this.mesh = MeshBuilder.CreateBox(this.nickname, {
      width: this.dimensions.x,
      height: this.dimensions.y,
      depth: this.dimensions.z
    }, this.scene);
    this.setPosition();
    this.setRotation();
    this.setColor();
  }

  public updateX(dimensions?: Dimensions, position?: Position, rotation?: number): void {
    if (dimensions !== undefined) {
      this.updateDimensions(dimensions);
    }
    if (position !== undefined) {
      this.updatePosition(position);
    }
    if (rotation !== undefined) {
      this.updateRotation(rotation);
    }
  }

  public update(player: Player) {
    this.log('[Paddle] Updating paddle for player:', player.nickname);
    this.updateDimensions(player.size);
    this.updatePosition(player.position);
    this.updateRotation(player.rotation);
    this.updateColor(player.color);
  }

  private updateDimensions(newDimensions: Dimensions) {
    if (newDimensions.width === this.dimensions.y &&
      newDimensions.height === this.dimensions.x &&
      newDimensions.depth === this.dimensions.z) {
      return;
    }
    this.dimensions.x = newDimensions.height;
    this.dimensions.y = newDimensions.width;
    this.dimensions.z = newDimensions.depth;
    this.setDimensions();
  }

  public updatePosition(newPosition: Position) {
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

  public updateRotation(newRotation: number) {
    if (newRotation === this.rotation) {
      return;
    }
    this.rotation = newRotation;
    this.setRotation();
  }

  public updateColor(newColor: string) {
    if (newColor === this.color) {
      return;
    }
    this.color = newColor;
    this.setColor();
  }

  private setDimensions() {
    if (!this.mesh) return;
    this.mesh.scaling = this.dimensions;
  }

  private setPosition() {
    if (!this.mesh) return;
    this.mesh.position = this.position;
  }

  private setRotation() {
    if (!this.mesh) return;
    this.mesh.rotation.z = this.rotation;
  }

  private setColor() {
    if (!this.mesh || !this.color) return;
    this.mesh.material = new StandardMaterial(this.nickname + '-material', this.scene);
    (this.mesh.material as StandardMaterial).diffuseColor = Color3.FromHexString(this.color);
  }

  public getMesh(): Mesh {
    return this.mesh;
  }

  public getId(): string {
    return this.mesh.name;
  }

  public getNickname(): string {
    return this.nickname;
  }

  public dispose(): void {
    if (this.mesh) {
      this.mesh.dispose();
    }
  }
}
