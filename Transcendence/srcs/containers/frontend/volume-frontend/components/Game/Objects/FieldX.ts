import { Mesh, MeshBuilder, Scene, Vector2, Vector3, Color3, StandardMaterial, VertexData } from '@babylonjs/core';
import { PolygonMeshBuilder } from '@babylonjs/core';
import { Field, Wall } from '../Models/Field';
import { Point } from '../Models/Point';
import earcut from 'earcut';
import Logger from '@utils/Logger';

import { GROUND_Z, WALL_HEIGHT, WALL_WIDTH } from './constants';

export class FieldX {
  private mesh: Mesh | null = null;
  private id: number;
  private walls: WallX[] = [];
  private scene: Scene;
  private material: StandardMaterial | null = null;

  private points: Point[];
  private flatVertices3D: number[]; // Flat array of vertices in 3D space [x1, y1, z1,  x2, y2, z2,  ...]
  private flatVertices2D: number[]; // Flat array of vertices in 2D space [x1, y1,  x2, y2,  ...]

  private logEnabled: boolean = false;

  constructor(scene: Scene, field: Field) {
    this.log('Creating:', field);
    this.scene = scene;
    this.id = field.id;
    this.points = this.getPoints(field);
    this.initFlatVertices();
    this.createWalls(field.walls);
    this.initMaterial();
    this.initialiseMesh();
  }

  public setLogEnabled(enabled: boolean): void {
    this.logEnabled = enabled;
  }
  private log(...args: any[]) {
    if (this.logEnabled)
      Logger.log(`[FieldX]`, ...args);
  }

  private getPoints(field: Field): Point[] {
    return field.points.map(pointData => {
      const point = new Point();
      point.position.x = pointData.position.x;
      point.position.y = pointData.position.y;
      point.position.z = GROUND_Z;
      return point;
    });
  }

  private initFlatVertices(): void {
    const flatVertices2D: number[] = [];
    const flatVertices3D: number[] = [];
    this.points.forEach(point => {
      flatVertices2D.push(point.position.x, point.position.y);
      flatVertices3D.push(point.position.x, point.position.y, point.position.z);
    });
    this.flatVertices2D = flatVertices2D;
    this.flatVertices3D = flatVertices3D;
  }

  private initMaterial(): void {
    this.log('Creating field material');
    const material = new StandardMaterial(`fieldMat-${this.id}`, this.scene);
    material.diffuseColor = new Color3(0.1, 0.1, 0.2);
    material.specularColor = new Color3(0.2, 0.2, 0.3);
    // material.emissiveColor = new Color3(0.2, 0.2, 0.3);
    this.material = material;
  }

  private initialiseMesh(): void {
    this.log('Initialising mesh');
    this.log(`Initialising ${this.points.length}-sided polygon mesh`);
    const mesh = new Mesh(`field-${this.id}`, this.scene);
    const vertexData = new VertexData();
    const positions = this.flatVertices3D;
    const indices = this.triangulate();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = [];
    try {
      VertexData.ComputeNormals(positions, indices, vertexData.normals);
    } catch (error) {
      Logger.error('Error computing normals:', error);
    }
    vertexData.applyToMesh(mesh, true);
    mesh.material = this.material;
    mesh.material.backFaceCulling = false; // See both sides
    this.mesh = mesh;
  }

  private triangulate(): number[] {
    return earcut(this.flatVertices2D);
  }

  private createWalls(walls: Wall[]): void {
    for (const wall of walls) {
      const wallX = new WallX(this.scene, wall);
      this.walls.push(wallX);
    }
  }

  // TODO: future feature: Update the field mesh when walls change
  public update(field: Field): void {
    for (const wall of field.walls) {
      const existingWall = this.walls.find(w => w.getId() === wall.id);
      if (existingWall) {
        existingWall.update(wall);
      } else {
        const newWall = new WallX(this.scene, wall);
        this.walls.push(newWall);
      }
    }
  }

  public getWalls(): WallX[] {
    return this.walls;
  }

  public getMesh(): Mesh | null {
    return this.mesh;
  }

  public getId(): number {
    return this.id;
  }

  public dispose(): void {
    if (this.mesh) {
      this.mesh.dispose();
    }
    this.walls.forEach(wall => wall.dispose());
  }

}

type WallRole = 'normal' | 'playerIn' | 'bounce';

export class WallX {
  private mesh: Mesh;
  private id: number;
  private start: Vector2;
  private end: Vector2;
  private role: WallRole;
  private scene: Scene;
  private color: string;

  private dimensions: Vector3;
  private direction: Vector3;
  private rotation: number;
  private position: Vector3;
  private material: StandardMaterial | null = null;
  private wallHeight: number = WALL_HEIGHT;
  private wallWidth: number = WALL_WIDTH;

  private logEnabled: boolean = false;

  public setLogEnabled(enabled: boolean): void {
    this.logEnabled = enabled;
  }
  private log(...args: any[]) {
    if (this.logEnabled)
      Logger.log(`[WallX]`, ...args);
  }

  constructor(scene: Scene, wall: Wall) {
    this.scene = scene;
    this.id = wall.id;
    this.start = new Vector2(wall.start.position.x, wall.start.position.y);
    this.end = new Vector2(wall.end.position.x, wall.end.position.y);
    this.role = wall.role || 'normal';
    this.material = this.initMaterial();
    if (this.role === 'playerIn') {
      return; // Walls with players don't have a mesh
    }
    this.initialiseMesh();
  }

  private initMaterial(): StandardMaterial {
    const material = new StandardMaterial(`wallMat-${this.id}`, this.scene);
    material.emissiveColor = new Color3(0.2, 0.5, 1);
    material.specularColor = new Color3(0.1, 0.1, 0.1);
    material.diffuseColor = new Color3(0.1, 0.1, 0.1);
    return material;
  }

  private initialiseMesh(): void {
    this.log('Initialising wall mesh');
    const direction = new Vector3(this.end.x - this.start.x, this.end.y - this.start.y, 0);
    const length = direction.length();
    this.mesh = MeshBuilder.CreateBox(
      `wall-${this.id}`,
      {
        width: length,
        height: this.wallWidth,
        depth: this.wallHeight
      },
      this.scene
    );
    const normal = new Vector3(-direction.y, direction.x, 0).normalize();
    this.log('Line:', direction);
    this.log('Normal:', normal);
    this.mesh.position = new Vector3(
      (this.start.x + this.end.x) / 2 + normal.x * this.wallWidth / 2,
      (this.start.y + this.end.y) / 2 + normal.y * this.wallWidth / 2,
      this.wallWidth
    );
    this.mesh.rotation.z = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
  }

  public update(wall: Wall): void {
    if (wall.start.position.x === this.start.x
      && wall.start.position.y === this.start.y
      && wall.end.position.x === this.end.x
      && wall.end.position.y === this.end.y) {
      return;
    }
    this.start = new Vector2(wall.start.position.x, wall.start.position.y);
    this.end = new Vector2(wall.end.position.x, wall.end.position.y);
    this.dispose();
    this.initialiseMesh();
  }

  public getMesh(): Mesh {
    return this.mesh;
  }

  public getId(): number {
    return this.id;
  }

  public getRole(): WallRole {
    return this.role;
  }

  public getStart(): Vector2 {
    return this.start;
  }

  public getEnd(): Vector2 {
    return this.end;
  }

  public getPosition(): Vector3 {
    return this.mesh.position;
  }

  public dispose(): void {
    if (this.mesh) {
      this.mesh.dispose();
    }
  }
}
