import { gameWebSocket } from '../../components/Game/GameWebSocket';
import createBasicPageLayout from '@components/basicpage.layout';
import Logger from '@utils/Logger';
import { game } from '@components/Game/Game';

export default async function playMenuRender(root: HTMLElement) {
  Logger.debug('playMenuRender called');
  gameWebSocket.connect();
  const contentArea = createBasicPageLayout('play');
  const gameArea = game.getElement();
  game.setContext('play');
  contentArea.appendChild(gameArea);
}
