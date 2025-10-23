import { gameWebSocket } from '@components/Game/GameWebSocket';
import createBasicPageLayout from '@components/basicpage.layout';
import Logger from '@utils/Logger';
import { game } from '@components/Game/Game';

export default function tournamentRender(root: HTMLElement) {
  Logger.debug('tournamentRender called');
  gameWebSocket.connect();
  const contentArea = createBasicPageLayout('tournament');
  const gameArea = game.getElement();
  game.setContext('tournament');
  contentArea.appendChild(gameArea);
}
