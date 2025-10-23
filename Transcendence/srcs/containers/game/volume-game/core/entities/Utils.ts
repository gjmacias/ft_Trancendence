// Utils.ts
import { Camera } from './Camera';
import { GameState } from './GameState';
import { Wall } from './Field';
import { Player, setRotationWithWall } from './Player';
import { Ball } from './Ball';
import { BALLS_NORMAL_SPEED} from '../Constants/ConstBall';


export function massBall(radius: number) : number
{
	return (4/3) * Math.PI * Math.pow(radius, 3);
}

export function normalize(vector: { x: number; y: number; z?: number }) {
  const z = vector.z ?? 0;
  const length = Math.sqrt(vector.x ** 2 + vector.y ** 2 + z ** 2);

  if (length === 0) return { x: 0, y: 0, z };

  return {
    x: vector.x / length,
    y: vector.y / length,
    z: z / length
  };
}

export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}
// export function enableCameraControls(canvas: HTMLCanvasElement, camera: Camera) {
//   let isDragging = false;
//   let previousX = 0;
//   let previousY = 0;
//   let alpha = Math.atan2(camera.position.z, camera.position.x);
//   let beta = Math.acos(camera.position.y / getRadius(camera));
//   let radius = getRadius(camera);

//   const target = camera.target;

//   canvas.addEventListener('mousedown', (e) => {
//     isDragging = true;
//     previousX = e.clientX;
//     previousY = e.clientY;
//   });

//   canvas.addEventListener('mouseup', () => {
//     isDragging = false;
//   });

//   canvas.addEventListener('mousemove', (e) => {
//     if (!isDragging) return;

//     const deltaX = e.clientX - previousX;
//     const deltaY = e.clientY - previousY;
//     previousX = e.clientX;
//     previousY = e.clientY;

//     alpha += deltaX * 0.005;
//     beta -= deltaY * 0.005;

//     // Clamp beta to avoid flipping
//     beta = Math.max(0.01, Math.min(Math.PI - 0.01, beta));

//     updateCameraPosition(camera, alpha, beta, radius);
//   });

//   // Zoom con la rueda del ratón
//   canvas.addEventListener('wheel', (e) => {
//     e.preventDefault();
//     radius += e.deltaY * 0.01;
//     radius = Math.max(camera.minZoom || 10, Math.min(camera.maxZoom || 200, radius));
//     updateCameraPosition(camera, alpha, beta, radius);
//   });
// }

// export function updateCameraPosition(camera: Camera, alpha: number, beta: number, radius: number) {
//   const { x, y, z } = camera.target;

//   camera.position.x = x + radius * Math.sin(beta) * Math.cos(alpha);
//   camera.position.y = y + radius * Math.cos(beta);
//   camera.position.z = z + radius * Math.sin(beta) * Math.sin(alpha);
// }

// export function getRadius(camera: Camera): number {
//   const dx = camera.position.x - camera.target.x;
//   const dy = camera.position.y - camera.target.y;
//   const dz = camera.position.z - camera.target.z;
//   return Math.sqrt(dx * dx + dy * dy + dz * dz);
// }

export function resetGameStateAfterPoint(gameState: GameState): void
{
	// Resetear posiciones de todas las bolas
	gameState.balls.forEach(ball => {
		if (ball.role === "ball") 
		{
			ball.position = { x: 0, y: 0, z: 0 };
			ball.direction = { x: Math.random() > 0.5 ? 1 : -1, y: (Math.random() - 0.5) * 0.5, z: 0 };
			ball.ballSpeed = BALLS_NORMAL_SPEED; // Velocidad inicial
			ball.owner = "";
			ball.powerUp
			
			// Normalizar dirección
			normalize(ball.direction);
		}
	});
	
	// Resetear posiciones de jugadores a sus posiciones iniciales de la pared
	gameState.field.walls.forEach(wall => {
		if (wall.role === "playerIn") {
			restartInWallPosition(wall);
		}
	});
	
	// Limpiar power-ups activos temporales
	gameState.balls = gameState.balls.filter(ball => ball.role === "ball");
	
	// Aplicar pausa temporal
	gameState.status = "paused"; // 2 segundos de pausa
}


/**
 * Función auxiliar para calcular rebote en superficies
 */
export function calculateBounceAngle(
  ball: Ball,
  player: Player, 
  impactPoint: { x: number; y: number }
): { x: number; y: number; z: number } {
  // Determinar posición relativa del impacto en el paddle (-1 a 1)
  const relativeY = (impactPoint.y - player.position.y) / (player.size.height / 2);
  const clampedRelativeY = Math.max(-1, Math.min(1, relativeY));
  
  // Calcular ángulo basado en la geometría del paddle
  const maxAngle = Math.PI / 4; // 45 grados máximo
  const bounceAngle = clampedRelativeY * maxAngle;
  
  // Determinar dirección horizontal basada en la posición del paddle
  const horizontalDirection = player.position.x < 0 ? 1 : -1;
  
  // Calcular nueva dirección
  const newDirection = {
    x: horizontalDirection * Math.cos(bounceAngle),
    y: Math.sin(bounceAngle),
    z: 0
  };
  
  // Normalizar el vector
  const magnitude = Math.sqrt(newDirection.x ** 2 + newDirection.y ** 2 + newDirection.z ** 2);
  
  return {
    x: newDirection.x / magnitude,
    y: newDirection.y / magnitude,
    z: newDirection.z / magnitude
  };
}

function restartInWallPosition(wall : Wall)
{
	const midX = (wall.start.position.x + wall.end.position.x) / 2;
	const midY = (wall.start.position.y + wall.end.position.y) / 2;

	for (const player of wall.players)
	{
		player.position.x = midX;
		player.position.y = midY;
		player.position.z = 0;

		setRotationWithWall(player, wall);

		player.percentage = 0.5;
		player.speed = 0;
		player.moving = 0;

		player.setpoint.x = midX;
		player.setpoint.y = midY;
		player.setpoint.z = 0;
	}	
}

export function calculateWallAngle(wall: Wall): number {
	const dX = wall.end.position.x - wall.start.position.x;
	const dY = wall.end.position.y - wall.start.position.y;
	let angle = Math.atan2(dY, dX);

	if (angle < 0) angle += 2 * Math.PI; // Asegura un ángulo positivo en [0, 2π)

	return angle;
}

// Rota un punto (x, y) un ángulo 'angle' en radianes, alrededor del (0, 0)
export function rotatePoint(x: number, y: number, angle: number): { x: number, y: number } {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return {
		x: x * cos - y * sin,
		y: x * sin + y * cos
	};
}

// Rota un punto hacia atrás (inversa)
export function rotatePointInverse(x: number, y: number, angle: number): { x: number, y: number } {
	return rotatePoint(x, y, -angle);
}

export function sleep(ms: number): Promise<void> 
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomColor(): string 
{
	const r = Math.floor(Math.random() * 256).toString(16).padStart(2, "0");
	const g = Math.floor(Math.random() * 256).toString(16).padStart(2, "0");
	const b = Math.floor(Math.random() * 256).toString(16).padStart(2, "0");

	return `#${r}${g}${b}`;
}
