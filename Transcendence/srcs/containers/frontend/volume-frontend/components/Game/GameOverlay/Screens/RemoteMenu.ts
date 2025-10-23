import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';
import Screen from './Screen';
import { API_ROUTES } from '@utils/api.routes';
import GameOverlay from '../GameOverlay';
import showAlert from '@components/showAlert';

import { game } from '@components/Game/Game';

export default class RemoteMenu extends Screen {
  private createButtonElement: HTMLButtonElement;
  private joinButtonElement: HTMLButtonElement
  private startGameButtonElement: HTMLButtonElement;
  private codeInputElement: HTMLInputElement;
  private joinedMessageElement: HTMLDivElement;
  private codeDisplayElement: HTMLDivElement;

  private code: string | null = null;

  constructor() {
    super();
    this.createElements();
    this.createRemoteMenu();
    this.hide();
  }

  private createRemoteMenu() {
    const remoteMenuScreen = MyHtml.div({
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
    this.element = remoteMenuScreen;
    this.setupInitialView();
  }

  private setupInitialView() {
    this.element.innerHTML = '';
    this.element.appendChild(this.createButtonElement);
    this.element.appendChild(this.joinButtonElement);
    this.element.appendChild(this.codeInputElement);
  }

  private setupLobbyView(role: 'host' | 'joiner', code?: string) {
    this.element.innerHTML = '';
    if (role === 'joiner') {
      this.element.appendChild(this.joinedMessageElement);
    }
    this.codeDisplayElement.textContent = `${langTools.getText(`overlay.remote-code-display`)} ${code}`;
    this.element.appendChild(this.codeDisplayElement);
    this.element.appendChild(this.startGameButtonElement);
  }
  
  private createElements() {
    this.createButtonElement = this.createCreateButton();
    this.createButtonElement.addEventListener('click', async () => {
      const code = await this.createButtonHandler();
      if (code) {
        this.setupLobbyView('host', code);
      }
    });
    this.joinButtonElement = this.createJoinButton();
    this.joinButtonElement.addEventListener('click', async () => {
      const code = this.codeInputElement.value.trim();
      if (code) {
        if (await this.joinButtonHandler(code)) {
          this.setupLobbyView('joiner', code);
        }
      } else {
        showAlert(langTools.getText('overlay.join-game-error-alert'));
      }
    });
    this.startGameButtonElement = this.createStartGameButton();
    this.startGameButtonElement.addEventListener('click', () => {
      this.startGameButtonHandler();
    });
    this.codeInputElement = this.createCodeInput();
    this.joinedMessageElement = this.createJoinedMessage();
    this.codeDisplayElement = this.createCodeDisplay('test');
  }

  private createCreateButton(): HTMLButtonElement {
    const button = MyHtml.button({
      text: langTools.getText(`overlay.create-game-button`),
      class: `button
      bg-blue-500
      text-white
      text-2xl
      font-bold
      px-6
      py-4
      rounded
      hover:bg-blue-600`,
      id: `create-game-button`
    });
    return button;
  }

  private createJoinButton(): HTMLButtonElement {
    const button = MyHtml.button({
      text: langTools.getText(`overlay.join-game-button`),
      class: `button
      bg-blue-500
      text-white
      text-2xl
      font-bold
      px-6
      py-4
      rounded
      hover:bg-blue-600`,
      id: `join-game-button`
    });
    return button;
  }

  private createCodeInput(): HTMLInputElement {
    const input = MyHtml.input({
      class: `input
      bg-gray-800
      text-white
      text-2xl
      font-bold
      px-6
      py-4
      rounded
      border-2
      border-gray-600
      focus:border-blue-500`,
      id: `game-code-input`,
      type: 'text'
    });
    return input;
  }

  private createStartGameButton(): HTMLButtonElement {
    const button = MyHtml.button({
      text: langTools.getText(`overlay.start-game-button`),
      class: `button
      bg-red-500
      text-white
      text-2xl
      font-bold
      px-6
      py-4
      rounded
      hover:bg-red-600`,
      id: `start-game-button`
    });
    return button;
  } 

  private createJoinedMessage(): HTMLDivElement {
    const message = MyHtml.div({
      text: langTools.getText(`overlay.joined-game-message`),
      class: `text-2xl
      font-bold
      text-white`,
      id: `joined-game-message`
    });
    return message;
  }

  private createCodeDisplay(code: string): HTMLDivElement {
    const display = MyHtml.div({
      text: `${langTools.getText(`overlay.remote-code-display`)} ${code}`,
      class: `text-4xl
      font-bold
      text-white`,
      id: `game-code-display`
    });
    return display;
  }

  private async createButtonHandler(): Promise<string | false> {
    try {
      const response = await fetch(API_ROUTES.GAME.CONNECT_REMOTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionStorage.getItem('sessionId'),
          matchmakingId: ''
        })
      });
      if (response.ok) {
        const data = await response.json();
        const code = data.matchmakingId;
        Logger.info('GAME CREATED, CODE: ' + code);
        this.code = code;
        return code;
      }
    } catch (error) {
      Logger.error('Error creating remote game: ' + error);
    }
    showAlert(langTools.getText('overlay.create-game-error-alert'));
    return false;
  }

  private async joinButtonHandler(code: string): Promise<Boolean> {
    try {
      const response = await fetch(API_ROUTES.GAME.CONNECT_REMOTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionStorage.getItem('sessionId'),
          matchmakingId: code
        })
      });
      if (response.ok) {
        Logger.info('JOINED GAME WITH CODE: ' + code);
        this.code = code;
        return true;
      }
    } catch (error) {
      Logger.error('Error joining remote game: ' + error);
    }
    showAlert(langTools.getText('overlay.join-game-error-alert'));
    return false;
  }

  private async startGameButtonHandler(): Promise<Boolean> {
    try {
      const response = await fetch(API_ROUTES.GAME.START_REMOTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          matchmakingId: this.code,
          sessionId: sessionStorage.getItem('sessionId')
        })
      });
      if (response.ok) {
        Logger.info('REMOTE GAME STARTED');
        game.start('remote');
        return true;
      }
    } catch (error) {
      Logger.error('Error starting remote game: ' + error);
    }
    showAlert(langTools.getText('overlay.start-remote-game-error-alert'));
    return false;
  }
}
