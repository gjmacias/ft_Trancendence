import API_ROUTES from "@utils/api.routes";
import Logger from "@utils/Logger";

import { GameMode, GameType } from '@components/Game/Game';
import { setupInputListeners, removeInputListeners } from "@components/Game/Input/listeners";

import toggleSidebar from '@components/Sidebar/sidebar.visibility';
import Navigator from '@/Navigator';

export async function startGameController(mode: GameMode): Promise<number> {
  Logger.debug('startGame() called with mode: "', mode);
  Navigator.setInternalNavigation(false);
  setupInputListeners();
  const status = await sendGameStartRequest(mode);
  if (status !== 210) {
    removeInputListeners();
    return status;
  }
  toggleSidebar(false);
  return status;
}

export async function startTournamentController(participants: any): Promise<Boolean> {
  Logger.debug('startTournament() called');
  if (await sendTournamentStartRequest(participants) === false) {
    return false;
  }
  Navigator.setInternalNavigation(false);
  setupInputListeners();
  toggleSidebar(false);
  return true;
}

export async function sendGameStartRequest(mode: GameMode): Promise<number> {
  Logger.debug('sendGameStartRequest() called with mode:', mode);
  let status = 400;
  if (mode === 'remote') {
    return 210;
  }

  const sessionId = sessionStorage.getItem('sessionId');
  try {
    const response = await fetch(API_ROUTES.GAME.START(mode), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({sessionId}),
    });
    status = response.status;
    if (status === 210) {
      Logger.info('Game started successfully');
      return status;
    } else {
      Logger.warn('Failed to start the game:', response.statusText);
    }
  } catch (error) {
    Logger.error('Error starting the game:', error);
  }
  return status;
}

type RegistryUser = {
  nickname: string;
  color: string;
};

type TournamentRegistryMessage = {
  mode: string;
  users: RegistryUser[];
};

export async function sendTournamentStartRequest(tournamentRegistryMessage: TournamentRegistryMessage): Promise<Boolean> {
  Logger.debug('sendTournamentStartRequest() called');
  const sessionId = sessionStorage.getItem('sessionId');
  try {
    const response = await fetch(API_ROUTES.GAME.TOURNAMENT, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, registry: tournamentRegistryMessage }),
    });
    if (response.status === 200) {
      Logger.debug('Tournament started successfully');
      return true;
    } else {
      Logger.error('Failed to start the tournament:', response.statusText);
    }
  } catch (error) {
    Logger.error('Error starting the tournament:', error);
  }
  return false;
}
