import { BALLS_NORMAL_RADIUS, BALLS_NORMAL_SPEED } from '../Constants/ConstBall';
import { Vector3 } from './Vector3';
import { PowerUp } from './PowerUp';
import { normalize } from './Utils';

export type BallRole = "ball" | "powerup" | "projectile";

export class Ball {
	id: number; // ID única
	role: BallRole; // Rol que cumple en el juego
	radius: number; // Radio del objeto
	color: string; // Color opcional
	ballSpeed: number; // Velocidad de la bola, si aplica
	controlFactor: number; // Factor de control, si aplica
	position: Vector3
	direction: Vector3
	trail: {
		stop: () => void;
	};
	isActive: boolean; // Si está en juego o no
	owner: string; //saber el ultimo jugador que la toco
	powerUp: PowerUp;
  	activePowerUps: PowerUp[]; // Array de power-ups temporales activos

  // ===================
    // GETTERS
    // ===================
    
    get ballId(): number {
        return this.id;
    }

    get ballRole(): BallRole {
        return this.role;
    }

    get ballRadius(): number {
        return this.radius;
    }

    get ballColor(): string {
        return this.color;
    }

    get speed(): number {
        return this.ballSpeed;
    }

    get control(): number {
        return this.controlFactor;
    }

    get currentPosition(): { x: number; y: number; z: number } {
        return { ...this.position }; // Copia para evitar mutación externa
    }

    get currentDirection(): { x: number; y: number; z: number } {
        return { ...this.direction }; // Copia para evitar mutación externa
    }

    get isInPlay(): boolean {
        return this.isActive;
    }

    get lastOwner(): string | undefined {
        return this.owner;
    }

    get currentPowerUp(): PowerUp | undefined {
        return this.powerUp;
    }

    get activePowerUpsList(): PowerUp[] {
        return [...this.activePowerUps]; // Copia para evitar mutación externa
    }

    get hasTrail(): boolean {
        return this.trail && typeof this.trail.stop === 'function';
    }

    // Getters derivados/calculados
    get velocity(): { x: number; y: number; z: number } {
        return {
            x: this.direction.x * this.ballSpeed,
            y: this.direction.y * this.ballSpeed,
            z: this.direction.z * this.ballSpeed
        };
    }

    get isMoving(): boolean {
        return this.ballSpeed > 0 && this.isActive;
    }

    get distanceFromOrigin(): number {
        return Math.sqrt(
            this.position.x ** 2 + 
            this.position.y ** 2 + 
            this.position.z ** 2
        );
    }

    // ===================
    // SETTERS
    // ===================

    set ballId(id: number) {
        if (id < 0) throw new Error("Ball ID must be non-negative");
        this.id = id;
    }

    set ballRole(role: BallRole) {
        this.role = role;
    }

    set ballRadius(radius: number) {
        if (radius <= 0) throw new Error("Ball radius must be positive");
        this.radius = radius;
    }

    set ballColor(color: string) {
        if (!color.trim()) throw new Error("Ball color cannot be empty");
        this.color = color;
    }

    set speed(speed: number) {
        if (speed < 0) throw new Error("Ball speed cannot be negative");
        this.ballSpeed = speed;
    }

    set control(factor: number) {
        if (factor < 0) throw new Error("Control factor cannot be negative");
        this.controlFactor = factor;
    }

    set currentPosition(pos: { x: number; y: number; z: number }) {
        this.position = { ...pos };
    }

    set currentDirection(dir: { x: number; y: number; z: number }) {
        // Normalizar automáticamente al asignar
        this.direction = normalize(dir);
    }

    set isInPlay(active: boolean) {
        this.isActive = active;
    }

    set lastOwner(playerId: string) {
        this.owner = playerId;
    }

    set currentPowerUp(powerUp: PowerUp) {
        this.powerUp = powerUp;
    }

    // Setters especializados
    setPosition(x: number, y: number, z: number = 0): void {
        this.position = { x, y, z };
    }

    setDirection(x: number, y: number, z: number = 0): void {
        this.direction = normalize({ x, y, z });
    }

    setVelocity(x: number, y: number, z: number = 0): void {
        const speed = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
        this.ballSpeed = speed;
        
        if (speed > 0) {
            this.direction = { x: x/speed, y: y/speed, z: z/speed };
        }
    }
}


function createNewBall(id : number): Ball {
  const newBall = new Ball();
  newBall.id = id;
  newBall.role = "ball";
  newBall.radius = BALLS_NORMAL_RADIUS; // Radio por defecto
  newBall.ballSpeed = BALLS_NORMAL_SPEED;
  newBall.position = { x: 0, y: 0, z: 0 };

  // Generar dirección aleatoria y normalizarla
  const rawDirection = {
    x: Math.random() > 0.5 ? 1 : -1,
    y: (Math.random() - 0.5) * 0.5,
    z: 0
  };

  newBall.direction = normalize(rawDirection);
  newBall.isActive = true;

  return newBall;
}

function resetBall(ball: Ball) {
  ball.position = { x: 0, y: 0, z: 0 };

  ball.direction = {
    x: ball.direction.x > 0 ? -1 : 1,
    y: (Math.random() - 0.5) * 0.5,
    z: 0
  };

  ball.direction = normalize(ball.direction);

  if (ball.trail) {
    ball.trail.stop();
  }
}

export { createNewBall, resetBall };
