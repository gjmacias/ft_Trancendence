import { Player } from '../Models/Player';
import MyHtml from '@utils/MyHtml3';
import Logger from '@utils/Logger';

export class ScoreboardX {
  private gameArea: HTMLElement;
  private element: HTMLElement;
  private scoreHtml: HTMLElement;
  private timerHtml: HTMLElement;
  private player1Container: HTMLElement;
  private player2Container: HTMLElement;
  private player1PowerUpsHtml: HTMLElement;
  private player2PowerUpsHtml: HTMLElement;
  private player1NicknameHtml: HTMLElement;
  private player2NicknameHtml: HTMLElement;
  private player1ScoreSpan: HTMLElement;
  private player2ScoreSpan: HTMLElement;

  private player1Score: number = 0;
  private player2Score: number = 0;
  private timer: string = '00:00';

  private visible: boolean = false;

  constructor(gameArea: HTMLDivElement) {
    this.gameArea = gameArea;
    this.createScoreboard();
    this.createPlayer1Container();
    this.createMiddleContainer();
    this.createPlayer2Container();
  }

  private createScoreboard() {
    const scoreboard = MyHtml.div({
      class: `scoreboard
      absolute
      top-0 left-1/2
      z-10
      flex
      h-[10%] w-[98%]
      -translate-x-1/2
      transform
      items-center
      justify-between
      z-30`,
      hidden: 'true'
    });
    this.element = scoreboard;
    this.gameArea.appendChild(scoreboard);
  }

  private createPlayer1Container() {
    const player1Container = MyHtml.div({
      class: `player-1-container flex h-full w-[30%] items-center justify-between bg-gradient-to-b from-blue-700/80 to-transparent px-4 py-1 text-white`
    });
    this.player1Container = player1Container;
    const player1NicknameContainer = MyHtml.div({
      class: `nickname flex-2 text-left mx-2 font-semibold`
    });
    const player1NicknameSpan = MyHtml.span('Player 1', {
      class: `p-2 text-4xl`
    });
    player1NicknameContainer.appendChild(player1NicknameSpan);
    player1Container.appendChild(player1NicknameContainer);
    this.player1NicknameHtml = player1NicknameSpan;
    const player1PowerUpsHtml = this.createPlayer1PowerUps();
    player1Container.appendChild(player1PowerUpsHtml);
    this.player1PowerUpsHtml = player1PowerUpsHtml;
    this.element.appendChild(player1Container);
  }

  private createPlayer1PowerUps(): HTMLElement {
    const player1PowerUpsHtml = MyHtml.div({
      class: `powerups flex flex-1 items-center gap-2 p-2`,
      hidden: 'true'
    });
    // Provisional example power-ups
    const powerUp1 = MyHtml.div({
      class: `powerup-1 h-8 w-8 rounded bg-yellow-400`,
      title: 'PowerUp 1'
    });
    const powerUp2 = MyHtml.div({
      class: `powerup-2 h-8 w-8 rounded bg-green-400`,
      title: 'PowerUp 2'
    });
    const powerUp3 = MyHtml.div({
      class: `powerup-3 h-8 w-8 rounded bg-purple-400`,
      title: 'PowerUp 3'
    });
    player1PowerUpsHtml.appendChild(powerUp1);
    player1PowerUpsHtml.appendChild(powerUp2);
    player1PowerUpsHtml.appendChild(powerUp3);
    return player1PowerUpsHtml;
  }

  private createPlayer2Container() {
    const player2Container = MyHtml.div({
      class: `player-2-container flex h-full w-[30%] items-center justify-between bg-gradient-to-b from-red-700/80 to-transparent px-4 py-1 text-white`
    });
    this.player2Container = player2Container;
    const player2NicknameContainer = MyHtml.div({
      class: `nickname flex-2 text-right mx-2 font-semibold`
    });
    const player2NicknameSpan = MyHtml.span('Player 2', {
      class: `p-2 text-4xl`
    });
    player2NicknameContainer.appendChild(player2NicknameSpan);
    player2Container.appendChild(player2NicknameContainer);
    this.player2NicknameHtml = player2NicknameSpan;
    const player2PowerUpsHtml = this.createPlayer2PowerUps();
    player2Container.appendChild(player2PowerUpsHtml);
    this.player2PowerUpsHtml = player2PowerUpsHtml;
    this.element.appendChild(player2Container);
  }

  private createPlayer2PowerUps(): HTMLElement {
    const player2PowerUpsHtml = MyHtml.div({
      class: `powerups flex flex-1 items-center gap-2 p-2`,
      hidden: 'true'
    });
    // Provisional example power-ups
    const powerUp1 = MyHtml.div({
      class: `powerup-1 h-8 w-8 rounded bg-yellow-400`,
      title: 'PowerUp 1'
    });
    const powerUp2 = MyHtml.div({
      class: `powerup-2 h-8 w-8 rounded bg-green-400`,
      title: 'PowerUp 2'
    });
    const powerUp3 = MyHtml.div({
      class: `powerup-3 h-8 w-8 rounded bg-purple-400`,
      title: 'PowerUp 3'
    });
    player2PowerUpsHtml.appendChild(powerUp1);
    player2PowerUpsHtml.appendChild(powerUp2);
    player2PowerUpsHtml.appendChild(powerUp3);
    return player2PowerUpsHtml;
  }

  private createMiddleContainer() {
    const middleContainer = MyHtml.div({
      class: `middle-container flex flex-1 flex-col items-center justify-center gap-0.5 px-2 text-white`
    });
    const scoreContainer = MyHtml.div({
      class: `score-container flex items-center gap-2 text-4xl font-bold`
    });
    const player1ScoreSpan = MyHtml.span('0', {
      class: `player1-score`
    });
    const separatorSpan = MyHtml.span('-', {
      class: `separator`
    });
    const player2ScoreSpan = MyHtml.span('0', {
      class: `player2-score`
    });
    scoreContainer.appendChild(player1ScoreSpan);
    scoreContainer.appendChild(separatorSpan);
    scoreContainer.appendChild(player2ScoreSpan);
    middleContainer.appendChild(scoreContainer);
    this.player1ScoreSpan = player1ScoreSpan;
    this.player2ScoreSpan = player2ScoreSpan;
    const timerHtml = MyHtml.div({
      text: '99:99',
      class: `timer text-lg text-white`,
      hidden: 'true'
    });
    middleContainer.appendChild(scoreContainer);
    middleContainer.appendChild(timerHtml);
    this.timerHtml = timerHtml;
    this.element.appendChild(middleContainer);
  }

  public show() {
    if (this.visible) return;
    this.visible = true;
    MyHtml.setAttributes(this.element, {
      hidden: '<rm>'
    });
  }

  public hide() {
    if (!this.visible) return;
    this.visible = false;
    MyHtml.setAttributes(this.element, {
      hidden: 'true'
    });
  }

  public reset() {
    this.player1Score = 0;
    this.player2Score = 0;
    this.timer = '00:00';
    this.updateScores(0, 0);
    this.updateTimer('00:00');
    this.updatePlayerNicknames('Player 1', 'Player 2');
    this.updatePowerUps([], []);
  }

  public update(players: Player[], timer?: string) {
    this.updatePlayerNicknames(players[0].nickname, players[1].nickname);
    this.updateScores(players[0].score, players[1].score);
    this.updateColors(players[0].color, players[1].color);
    if (timer)
      this.updateTimer(timer);
  }

  public updateScores(player1Score: number, player2Score: number) {
    this.player1ScoreSpan.textContent = player1Score.toString();
    this.player2ScoreSpan.textContent = player2Score.toString();
  }

  public updateColors(player1Color: string, player2Color: string) {
    this.player1Container.style.background = `linear-gradient(to bottom, ${player1Color}CC, transparent)`;
    this.player2Container.style.background = `linear-gradient(to bottom, ${player2Color}CC, transparent)`;
  }

  public updateTimer(time: string) {
    if (this.timer === time) return;
    this.timer = time;
    this.timerHtml.textContent = time;
    MyHtml.setAttributes(this.timerHtml, {
      hidden: '<rm>'
    });
  }

  public updatePlayerNicknames(player1Nickname: string, player2Nickname: string) {
    this.player1NicknameHtml.textContent = player1Nickname;
    this.player2NicknameHtml.textContent = player2Nickname;
  }

  public updatePowerUps(player1PowerUps: string[], player2PowerUps: string[]) {
    this.player1PowerUpsHtml.innerHTML = '';
    this.player2PowerUpsHtml.innerHTML = '';
    
    player1PowerUps.forEach(powerUp => {
      const powerUpHtml = MyHtml.div({
        class: `powerup h-8 w-8 rounded bg-yellow-400`,
        title: powerUp
      });
      this.player1PowerUpsHtml.appendChild(powerUpHtml);
    });

    player2PowerUps.forEach(powerUp => {
      const powerUpHtml = MyHtml.div({
        class: `powerup h-8 w-8 rounded bg-green-400`,
        title: powerUp
      });
      this.player2PowerUpsHtml.appendChild(powerUpHtml);
    });
  }

  public clear() {
    this.updateScores(0, 0);
    this.updateTimer('00:00');
    this.updatePlayerNicknames('Player 1', 'Player 2');
  }

  public getElement(): HTMLElement {
    return this.element;
  }
  public getGameArea(): HTMLElement {
    return this.gameArea;
  }

  public setGameArea(gameArea: HTMLElement): void {
    this.gameArea = gameArea;
  }

  public getScoreHtml(): HTMLElement {
    return this.scoreHtml;
  }

  public setScoreHtml(scoreHtml: HTMLElement): void {
    this.scoreHtml = scoreHtml;
  }

  public getTimerHtml(): HTMLElement {
    return this.timerHtml;
  }

  public setTimerHtml(timerHtml: HTMLElement): void {
    this.timerHtml = timerHtml;
  }

  public getPlayer1PowerUpsHtml(): HTMLElement {
    return this.player1PowerUpsHtml;
  }

  public setPlayer1PowerUpsHtml(player1PowerUpsHtml: HTMLElement): void {
    this.player1PowerUpsHtml = player1PowerUpsHtml;
  }

  public getPlayer2PowerUpsHtml(): HTMLElement {
    return this.player2PowerUpsHtml;
  }

  public setPlayer2PowerUpsHtml(player2PowerUpsHtml: HTMLElement): void {
    this.player2PowerUpsHtml = player2PowerUpsHtml;
  }

  public getPlayer1NicknameHtml(): HTMLElement {
    return this.player1NicknameHtml;
  }

  public setPlayer1NicknameHtml(player1NicknameHtml: HTMLElement): void {
    this.player1NicknameHtml = player1NicknameHtml;
  }

  public getPlayer2NicknameHtml(): HTMLElement {
    return this.player2NicknameHtml;
  }

  public setPlayer2NicknameHtml(player2NicknameHtml: HTMLElement): void {
    this.player2NicknameHtml = player2NicknameHtml;
  }

  public destroy() {
    this.gameArea.removeChild(this.getElement());
    this.gameArea = null;
    this.scoreHtml = null;
    this.timerHtml = null;
    this.player1PowerUpsHtml = null;
    this.player2PowerUpsHtml = null;
    this.player1NicknameHtml = null;
    this.player2NicknameHtml = null;
  }
}

/* HTML Reference
<div class="game-area relative h-200 w-300 bg-gray-600">
  <!-- Scoreboard -->
  <div class="scoreboard absolute top-0 left-1/2 z-10 flex h-[10%] w-[98%] -translate-x-1/2 transform items-center justify-between border border-gray-200/20 bg-white/10 shadow-lg backdrop-blur-sm">
    <!-- Player 1 -->
    <div class="player-1-container flex h-full w-[30%] items-center justify-between border-r border-gray-200 bg-blue-700 px-4 py-1 text-white">
      <div class="nickname flex-2 text-left text-2xl font-semibold">
        <span class="p-2 text-2xl">Player1</span>
      </div>
      <div class="powerups flex flex-1 items-center gap-2 p-2">
        <div class="powerup-1 h-8 w-8 rounded border-black/80 bg-yellow-400"></div>
        <div class="powerup-2 h-8 w-8 rounded border-black/80 bg-green-400"></div>
        <div class="powerup-3 h-8 w-8 rounded border-black/80 bg-purple-400"></div>
      </div>
    </div>

    <!-- Middle: Score + Timer -->
    <div class="middle-container flex flex-1 flex-col items-center justify-center gap-0.5 px-2 text-white">
      <div class="score-container flex items-center gap-2 text-4xl font-bold">
        <span class="player1-score">3</span>
        <span class="separator">-</span>
        <span class="player2-score">5</span>
      </div>
      <div class="timer text-lg">01:24</div>
    </div>

    <!-- Player 2 -->
    <div class="player-1-container flex h-full w-[30%] items-center justify-between border-r border-gray-200 bg-red-700 px-4 py-1 text-white">
      <div class="powerups flex flex-1 items-center gap-2 p-2">
        <div class="powerup-1 h-8 w-8 rounded bg-yellow-400"></div>
        <div class="powerup-2 h-8 w-8 rounded bg-green-400"></div>
        <div class="powerup-3 h-8 w-8 rounded bg-purple-400"></div>
      </div>
      <div class="nickname flex-2 text-right text-2xl font-semibold">
        <span class="p-2 text-2xl">Player2</span>
      </div>
    </div>
  </div>
</div>
*/