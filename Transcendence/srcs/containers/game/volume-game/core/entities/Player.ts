
///Palyer son los Paddles del juego, que pueden ser humanos, IA o bloques.
/// Son los jugadores que interactúan con la pelota y pueden recibir power-ups.
import {
    PLAYER_NORMAL_HEIGHT,
    PLAYER_NORMAL_WIDTH, PLAYER_NORMAL_DEPTH,
    PLAYER_SPAWN_X, PLAYER_SPAWN_Y, PLAYER_SPAWN_Z,
    PLAYER_DEFAULT_ROTATION, PLAYER_DEFAULT_SPEED, PLAYER_DEFAULT_PERCENTAGE
} from '../Constants/ConstPlayer';
import { Wall } from './Field';
import { Vector3 } from './Vector3';
import { PowerUp } from "./PowerUp";
import { calculateWallAngle } from './Utils';
import { User } from './User';

export type PlayerRole = "human" | "ai" | "block" | "spectator";

export class Player {
	fd: number;
	id: string; // ID única
	nickname: string; // Nombre visible en la UI
	elo: number; // Solo si es humano o IA
	role: PlayerRole; // Tipo de "jugador"
	position: Vector3;
	size: {
		width: number;
		height: number;
		depth: number;
	};
	rotation: number; // en radianes
	speed: number;
	moving: number;  // 1 | 0 | -1 
	score: number;
	isActive: boolean; // Si está participando o no
	isReady: boolean; // Si está participando o no
	isDeath: boolean; // Si está participando o no
	powerUps: PowerUp[]; // activos en la partida
	color: string;
	percentage: number; //de 0 a 1, depende de Wall
	timestamp: number;

	//AI
	setpoint: Vector3;

	constructor (user: User, role : PlayerRole)
	{
		this.fd = -1;
		this.id = (user.id) ? user.id : "";
		this.nickname = user.nickname;
		this.elo = (user.elo) ? user.elo : 1000;
		this.role = role;
		this.position = {
			x: PLAYER_SPAWN_X,
			y: PLAYER_SPAWN_Y,
			z: PLAYER_SPAWN_Z,
		};
		
		this.size = {
			width: PLAYER_NORMAL_WIDTH,
			height: PLAYER_NORMAL_HEIGHT,
			depth: PLAYER_NORMAL_DEPTH,
		};
		
		this.rotation = PLAYER_DEFAULT_ROTATION;
		this.speed = PLAYER_DEFAULT_SPEED;
		this.moving = 0;
		this.score = 0;
		this.isActive = true;
		this.isReady = false;
		this.isDeath = false;
		this.powerUps = []; // Corregido: era PowerUp[0] que causaba error
		this.color = (user.color) ? user.color : "#6040FF";
		this.percentage = PLAYER_DEFAULT_PERCENTAGE;
		this.timestamp = Date.now();
		this.setpoint = {
			x: 0,
			y: 0,
			z: 0,
		};
	}

	// Getters básicos
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

export function setRotationWithWall(player: Player, wall :Wall)
{
	player.rotation = calculateWallAngle(wall);
}