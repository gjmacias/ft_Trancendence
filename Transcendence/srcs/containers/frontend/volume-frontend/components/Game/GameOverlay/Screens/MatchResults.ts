import MyHtml from '@utils/MyHtml3';
import { GameState } from '../../Models/GameState';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';
import Screen from './Screen';

export default class MatchResults extends Screen {
  private player1ScoreElement: HTMLElement;
  private player2ScoreElement: HTMLElement;
  private titleElement: HTMLElement;
  private returnButtonElement: HTMLButtonElement;

  private playerScoreClasses: string = `player-score
      flex
      h-24 w-16
      items-center
      justify-center
      font-bold`;
  private playerScoreClassesWinner: string = this.playerScoreClasses + ' ' + 'text-[18rem]';
  private playerScoreClassesLoser: string = this.playerScoreClasses + ' ' + 'text-[16rem] text-gray-400';
  private playerScoreClassesTie: string = this.playerScoreClasses + ' ' + 'text-[16rem]';

  constructor() {
    super();
    this.createMatchResultsScreen();
    this.hide();
  }

  private createMatchResultsScreen() {
    const matchResultsScreen = MyHtml.div({
      class: `match-results-screen
      flex flex-col
      relative
      w-full
      bg-black
      space-y-8
      pt-24
      p-8`,
      id: 'match-results-screen'
    });
    this.element = matchResultsScreen;
    const title = MyHtml.h1('', {
      class: `match-results-title
      absolute
      top-[15%]
      left-1/2
      -translate-x-1/2
      text-8xl
      text-center
      font-semibold`,
      id: 'match-results-title'
    });
    this.titleElement = title;
    matchResultsScreen.appendChild(title);
    const scoreContainer = this.createScoreContainer();
    matchResultsScreen.appendChild(scoreContainer);
    const returnButton = MyHtml.button({
      text: langTools.getText('overlay.results-return-button'),
      class: `return-button
      absolute
      bottom-[10%]
      left-1/2
      -translate-x-1/2
      rounded-md
      py-4
      px-8
      text-white
      text-2xl
      font-bold
      bg-linear-to-b
      from-yellow-500
      to-yellow-600
      hover:from-yellow-400
      hover:to-yellow-500
      active:from-yellow-600
      active:to-yellow-700
      shadow-md
      shadow-white/10
      hover:shadow-lg
      hover:shadow-white/20
      active:shadow-lg
      active:shadow-white/5
      cursor-pointer
      transition-colors`,
      id: 'return-button'
    });
    returnButton.addEventListener('click', () => {
      window.location.reload();
    });
    this.returnButtonElement = returnButton;
    matchResultsScreen.appendChild(returnButton);
  }

  private createScoreContainer(): HTMLElement {
    const scoreContainer = MyHtml.div({
      class: `score-container
      absolute
      top-1/2
      left-1/2
      -translate-x-1/2
      -translate-y-1/2
      flex
      items-center
      justify-center
      gap-24`,
      id: 'score-container'
    });
    const player1Score = MyHtml.div({
      text: '0',
      class: this.playerScoreClasses,
      id: 'player1-score'
    });
    this.player1ScoreElement = player1Score;
    const dash = MyHtml.div({
      text: '-',
      class: `dash
      text-[14rem]
      font-bold`,
      id: 'score-dash'
    });
    const player2Score = MyHtml.div({
      text: '0',
      class: this.playerScoreClasses,
      id: 'player2-score'
    });
    this.player2ScoreElement = player2Score;
    scoreContainer.appendChild(player1Score);
    scoreContainer.appendChild(dash);
    scoreContainer.appendChild(player2Score);
    return scoreContainer;
  }

  public update(gameState: GameState, userSide: 'left' | 'right' = 'left'): void {
    if (gameState.status !== 'ended') {
      Logger.info('Game has not ended yet, skipping update.');
      return;
    }
    const player1 = userSide === 'left' ? gameState.players[0] : gameState.players[1];
    const player2 = userSide === 'left' ? gameState.players[1] : gameState.players[0];
    MyHtml.resetAttributes(this.player1ScoreElement);
    MyHtml.resetAttributes(this.player2ScoreElement);
    MyHtml.setAttributes(this.player1ScoreElement, {
      text: player1.score.toString(),
      class: this.playerScoreClasses
    })
    MyHtml.setAttributes(this.player2ScoreElement, {
      text: player2.score.toString(),
      class: this.playerScoreClasses
    })
    if (player1.score === player2.score) {
      MyHtml.setAttributes(this.player1ScoreElement, {
        class: this.playerScoreClassesTie
      });
      MyHtml.setAttributes(this.player2ScoreElement, {
        class: this.playerScoreClassesTie
      });
      this.titleElement.textContent = langTools.getText('overlay.results-title.draw');
    } else {
      const winner = player1.score > player2.score ? player1 : player2;
      const loser = player1.score > player2.score ? player2 : player1;
      const winnerScoreElement = winner.nickname === player1.nickname ? this.player1ScoreElement : this.player2ScoreElement;
      const loserScoreElement = loser.nickname === player1.nickname ? this.player1ScoreElement : this.player2ScoreElement;
      this.titleElement.textContent = `${winner.nickname} ${langTools.getText('overlay.results-title.wins')}`;
      this.titleElement.style.color = winner.color;
      MyHtml.setAttributes(winnerScoreElement, {
        class: this.playerScoreClassesWinner
      });
      MyHtml.setAttributes(loserScoreElement, {
        class: this.playerScoreClassesLoser
      });
    }
  }

  public show(gameState?: GameState, mode: 'play' | 'tournament' = 'tournament', userSide: 'left' | 'right' = 'left'): void {
    this.element.style.display = 'flex';
    this.returnButtonElement.style.display = 'flex';
    if (mode === 'tournament') {
      this.returnButtonElement.style.display = 'none';
    }
    if (gameState) {
      this.update(gameState, userSide);
    }
  }
}
