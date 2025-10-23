import MyHtml from '@utils/MyHtml3';
import Screen from './Screens/Screen';
import Loading from './Screens/Loading';
import ModeSelection from './Screens/ModeSelection';
import RemoteMenu from './Screens/RemoteMenu';
import MatchAnnouncement from './Screens/MatchAnnouncement';
import MatchResults from './Screens/MatchResults';
import TournamentRegistration from './Screens/TournamentRegistration';
import TournamentResults from './Screens/TournamentResults';
import GameError from './Screens/GameError';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

import { Player } from '../Models/Player';
export type GameState = {
  status: 'ended';
  players: {
    nickname: string;
    score: number;
    color?: string;
  }[];
};

type OverlayScreenName =
  | 'modeSelection'
  | 'remoteMenu'
  | 'loading'
  | 'matchAnnouncement'
  | 'matchResults'
  | 'tournamentRegistration'
  | 'tournamentResults'
  | 'gameError'
  | 'none';

export default class GameOverlay {
  private static instance: GameOverlay;

  public static getInstance(): GameOverlay {
    if (!GameOverlay.instance) {
      GameOverlay.instance = new GameOverlay();
    }
    return GameOverlay.instance;
  }

  private element: HTMLDivElement;
  private visible: boolean = true;

  private activeScreen: Screen | null = null;
  private activeScreenName: OverlayScreenName | null = null;
  private screens: { [key in OverlayScreenName]?: Screen } = {};

  constructor() {
    this.createOverlay();
    this.screens.loading = new Loading();
    this.element.appendChild(this.screens.loading.getElement());
    this.screens.modeSelection = new ModeSelection();
    this.element.appendChild(this.screens.modeSelection.getElement());
    this.screens.remoteMenu = new RemoteMenu();
    this.element.appendChild(this.screens.remoteMenu.getElement());
    this.screens.matchAnnouncement = new MatchAnnouncement();
    this.element.appendChild(this.screens.matchAnnouncement.getElement());
    this.screens.matchResults = new MatchResults();
    this.element.appendChild(this.screens.matchResults.getElement());
    this.screens.tournamentRegistration = new TournamentRegistration();
    this.element.appendChild(this.screens.tournamentRegistration.getElement());
    this.screens.gameError = new GameError();
    this.element.appendChild(this.screens.gameError.getElement());
    this.screens.tournamentResults = new TournamentResults();
    this.element.appendChild(this.screens.tournamentResults.getElement());
    this.hide();
  }

  public getElement(): HTMLDivElement {
    return this.element;
  }

  private createOverlay() {
    this.element = MyHtml.div({
      class: `absolute
      left-0 top-0
      w-full h-full
      flex
      text-white
      z-100`,
      id: 'game-overlay',
    });
  }

  public show(screenName?: OverlayScreenName, ...args: any[]) {
    this.visible = true;
    this.element.style.display = 'flex';
    if (screenName) {
      this.setScreen(screenName, ...args);
    }
  }
  public hide() {
    this.visible = false;
    this.element.style.display = 'none';
  }

  public setScreen(screenName: OverlayScreenName, ...args: any[]) {
    // Logger.debug('Setting overlay screen to: ' + screenName);
    if (this.activeScreen) {
      // Logger.debug('Hiding current active screen');
      this.activeScreen.hide();
    }
    if (screenName === 'none') {
      this.activeScreenName = null;
      this.activeScreen = null;
      return;
    }
    const newScreen = this.screens[screenName];
    if (newScreen) {
      this.activeScreen = newScreen;
      this.activeScreenName = screenName;
      if (args.length > 0) {
        this.activeScreen.show(...args);
      } else {
        this.activeScreen.show();
      }
    } else {
      Logger.warn(`Screen ${screenName} does not exist in GameOverlay.`);
    }
  }

  public getScreenName(): OverlayScreenName | null {
    // Logger.debug('Current active screen: ' + this.activeScreenName);
    return this.activeScreenName;
  }
  public getScreen(screenName?: OverlayScreenName): Screen | null {
    if (!screenName) {
      return this.activeScreen;
    }
    return this.screens[screenName] || null;
  }

  public testScreen(screenName: OverlayScreenName) {
    const mockPlayer1 = new Player();
    mockPlayer1.nickname = 'Misco';
    mockPlayer1.color = '#103AFF';
    mockPlayer1.score = 3;
    const mockPlayer2 = new Player();
    mockPlayer2.nickname = 'Wawa';
    mockPlayer2.color = '#B54A20';
    mockPlayer2.score = 5;
    const gameStateMock: GameState = {
      status: 'ended',
      players: [
        {
          nickname: mockPlayer1.nickname,
          score: mockPlayer1.score,
          color: mockPlayer1.color,
        },
        {
          nickname: mockPlayer2.nickname,
          score: mockPlayer2.score,
          color: mockPlayer2.color,
        },
      ],
    };
    if (screenName === 'matchAnnouncement') {
      this.show('matchAnnouncement', mockPlayer1, mockPlayer2);
    } else if (screenName === 'matchResults') {
      this.show('matchResults', gameStateMock, 'play');
    } else if (screenName === 'tournamentRegistration') {
      this.show('tournamentRegistration');
    } else if (screenName === 'modeSelection') {
      this.show('modeSelection');
    } else if (screenName === 'loading') {
      this.show('loading');
    } else if (screenName === 'gameError') {
      this.show('gameError');
    } else {
      Logger.warn(`Test screen ${screenName} is not implemented.`);
    }
  }
}
