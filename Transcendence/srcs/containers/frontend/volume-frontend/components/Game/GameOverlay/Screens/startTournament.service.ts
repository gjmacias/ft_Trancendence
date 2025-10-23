import { API_ROUTES } from '@utils/api.routes';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';
import showAlert from '@components/showAlert';

type RegistryUser = {
  nickname: string;
  color: string;
};

type TournamentRegistryMessage = {
  mode: string;
  users: RegistryUser[];
};

export default async function startTournamentService(message: TournamentRegistryMessage): Promise<boolean> {
  try {
    const response = await fetch(API_ROUTES.GAME.TOURNAMENT, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      throw new Error('Failed to start tournament');
    }
    const data = await response.json();
    Logger.info('Tournament started successfully: ' + data);
    return true;
  } catch (error) {
    Logger.error('Error starting tournament: ' + error.message);
    showAlert(langTools.getText('tournament.alert-registration-fail'));
  }
  return false;
}
