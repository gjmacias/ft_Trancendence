// services/game.service.ts
import { User } from '../../../core/entities/User';
import { gamePrepare } from '../../../core/game/game/GamePrepare';
import { myPongServer } from '../../../game';
import { broadcastStateSnapshot } from '../../wss/services/socket.service';

export async function startGame(mode: string, user: User) {
  return gamePrepare(mode, user);
}

export function reconnectPlayer(userId: string): boolean {
	const game = [...myPongServer.games].find(g =>
		g.players.some(p => p.id === userId)
	);

	if (!game) return false; 

	const player = game.players.find(p => p.id === userId);
	if (!player) return false;

	//broadcastStateSnapshot(game);
	//player.isActive = true;

	return true;
}