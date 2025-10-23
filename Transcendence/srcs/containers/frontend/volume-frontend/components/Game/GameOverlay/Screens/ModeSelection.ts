import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';
import Screen from './Screen';

import GameOverlay from '../GameOverlay';

import { game } from '@components/Game/Game';

export default class ModeSelection extends Screen {
  constructor() {
    super();
    this.createModeSelection();
    this.hide();
  }

  private createModeSelection() {
    const modeSelectionScreen = MyHtml.div({
      class: `game-selector-screen
      overlay
      absolute
      top-0 left-0
      w-full h-full
      flex
      items-center
      justify-center
      bg-black
      text-white
      p-8
      gap-4
      z-100`,
      id: 'game-selector-screen'
    });
    const localGameButton = this.createGameButton('local');
    localGameButton.addEventListener('click', this.localGameButtonHandler);
    modeSelectionScreen.appendChild(localGameButton);
    const botGameButton = this.createGameButton('bot');
    botGameButton.addEventListener('click', this.botGameButtonHandler);
    modeSelectionScreen.appendChild(botGameButton);
    const remoteGameButton = this.createGameButton('remote');
    remoteGameButton.addEventListener('click', this.remoteGameButtonHandler);
    modeSelectionScreen.appendChild(remoteGameButton);
    this.element = modeSelectionScreen;
  }

  private createGameButton(type: 'local' | 'bot' | 'remote'): HTMLButtonElement {
    const button = MyHtml.button({
      text: langTools.getText(`overlay.start-${type}-game-button`),
      class: `button
      bg-blue-500
      text-white
      text-2xl
      font-bold
      px-6
      py-4
      rounded
      hover:bg-blue-600`,
      id: `${type}-game-button`
    });
    return button;
  }

  private localGameButtonHandler() {
    // Logger.debug('LOCAL GAME BUTTON PRESSED; (components/Game/GameScreens/GameSelector.ts)');
    game.start('local');
  }
  private botGameButtonHandler() {
    // Logger.debug('BOT GAME BUTTON PRESSED; (components/Game/GameScreens/GameSelector.ts)');
    game.start('bot');
  }

  private remoteGameButtonHandler() {
    // Logger.debug('ONLINE GAME BUTTON PRESSED, DOESN\'T DO ANYTHING RIGHT NOW; (components/Game/GameScreens/GameSelector.ts)');
    GameOverlay.getInstance().setScreen('remoteMenu');
  }

}
