import { Vector3 } from './Vector3';
import { PowerUp } from './PowerUp';

export type BallRole = "ball" | "powerup" | "projectile";

export class Ball {
	id: number;
	role: BallRole;
	radius: number;
	color: string;
	ballSpeed: number;
	controlFactor: number;
	position: Vector3
	direction: Vector3
	trail: {
		stop: () => void;
	};
	isActive: boolean;
	owner: number;
	powerUp: PowerUp;
	activePowerUps: PowerUp[];
	
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
		return { ...this.position };
	}

	get currentDirection(): { x: number; y: number; z: number } {
		return { ...this.direction };
	}

	get isInPlay(): boolean {
		return this.isActive;
	}

	get lastOwner(): number | undefined {
		return this.owner;
	}

	get currentPowerUp(): PowerUp | undefined {
		return this.powerUp;
	}

	get activePowerUpsList(): PowerUp[] {
		return [...this.activePowerUps];
	}

	get hasTrail(): boolean {
		return this.trail && typeof this.trail.stop === 'function';
	}

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
		// this.direction = normalize(dir);
	}

	set isInPlay(active: boolean) {
		this.isActive = active;
	}

	set lastOwner(playerId: number) {
		this.owner = playerId;
	}

	set currentPowerUp(powerUp: PowerUp) {
		this.powerUp = powerUp;
	}
}
