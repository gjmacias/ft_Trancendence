export const 	TICKSEND = 64, // Número de "ticks" (actualizaciones para el cliente) por segundo 
				TICKWAIT = 5, // Número de "ticks" (actualizaciones para el cliente) por segundo
				TICKRATE = TICKSEND * TICKWAIT, // Número de "ticks" (actualizaciones lógicas del juego) por segundo	SERVIDOR
				TICK = 1000 / TICKRATE, // Duración de un tick en milisegundos (1000 ms dividido entre la cantidad de ticks por segundo) SERVIDOR	
				POWERUP_MAX_SIZE = 3,

				INPUTS_DELAY = TICKRATE,
				AI_REACTION_THRESHOLD = 2,

				TIME_GAME_WAITING = 1 * 60 * 1000,
				TIME_GAME_PAUSED = 1 * 10 * 1000,
				TIME_GAME_RESULT = 1 * 5 * 1000,
				TIME_TOURNAMENT_ANNONCEMENT = 1 * 5 * 1000,

				TIME_GAME_DEFAULT = 5 * 60 * 1000,
				WIN_SCORE_DEFAULT = 5,
				PHI = (1 + Math.sqrt(5)) / 2,
				ONE_SECOND = 1 * 1000
				;
