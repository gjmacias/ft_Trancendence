import MyHtml from '@utils/MyHtml3';
import { Player } from '../../Models/Player';
import langTools from '@utils/LanguageTools';
import Screen from './Screen';
import Logger from '@utils/Logger';

export default class MatchAnnouncement extends Screen {
  private matchupSection: HTMLElement;
  private player1NicknameElement: HTMLSpanElement;
  private player2NicknameElement: HTMLSpanElement;
  private countdownSectionElement: HTMLElement;
  private countdownNumberElement: HTMLElement;

  private player1: Player | null;
  private player2: Player | null;

  private countdownSeconds: number = 5;

  constructor(player1?: Player, player2?: Player) {
    super();
    this.player1 = player1 || null;
    this.player2 = player2 || null;
    this.createMatchAnnouncementScreen();
    this.createMatchupSection();
    this.element.appendChild(this.matchupSection);
    this.createCountdownSection();
    this.element.appendChild(this.countdownSectionElement);
    this.hide();
  }

  private createMatchAnnouncementScreen() {
    const matchAnnouncement = MyHtml.div({
      class: `match-announcement-screen
      border-8 border-red-700
      flex flex-col
      w-full h-full
      bg-black
      space-y-20
      p-8
      items-center
      justify-center`,
      id: 'match-announcement-screen'
    });
    this.element = matchAnnouncement;
    const title = MyHtml.div({
      class: `match-announcement-title text-center text-6xl font-semibold mb-16`,
      id: 'match-announcement-title',
      text: langTools.getText('overlay.announcement-title')
    });
    matchAnnouncement.appendChild(title);
  }

  private createMatchupSection() {
    const matchupSection = MyHtml.div({
      class: `player-matchup
      flex
      items-center
      justify-center
      gap-8
      text-7xl
      font-medium
      text-gray-700`,
      id: 'player-matchup'
    });
    this.matchupSection = matchupSection;
    const player1NicknameElement = MyHtml.span('Player1', {
      class: `player-nickname font-bold`,
      id: 'player1-nickname'
    });
    this.player1NicknameElement = player1NicknameElement;
    matchupSection.appendChild(player1NicknameElement);
    const vsElement = MyHtml.span('VS.', {
      class: `vs text-5xl text-gray-400 font-semibold`,
      id: 'matchup-vs'
    });
    matchupSection.appendChild(vsElement);
    const player2NicknameElement = MyHtml.span('Player2', {
      class: `player-nickname font-bold`,
      id: 'player2-nickname'
    });
    this.player2NicknameElement = player2NicknameElement;
    matchupSection.appendChild(player2NicknameElement);
  }

  private createCountdownSection() {
    const countdownSection = MyHtml.div({
      class: `countdown-section space-y-16 p-8 text-center`,
      id: 'countdown-section'
    });
    this.countdownSectionElement = countdownSection;
    const countdownTitle = MyHtml.div({
      text: langTools.getText('overlay.countdown-title'),
      class: `countdown-title text-6xl font-semibold`,
      id: 'countdown-title'
    })
    countdownSection.appendChild(countdownTitle);
    const countdownContainer = MyHtml.div({
      class: `countdown-container flex items-center justify-center gap-6`,
      id: 'countdown-container'
    });
    const countdownSpan = MyHtml.span(langTools.getText('overlay.countdown-text'), {
      class: `countdown-span text-5xl font-semibold whitespace-nowrap`,
      id: 'countdown-span'
    });
    countdownContainer.appendChild(countdownSpan);
    const countdownNumber = MyHtml.span(this.countdownSeconds.toString(), {
      class: `countdown-number text-5xl font-bold text-red-400 min-w-[3ch]`,
      id: 'countdown-number'
    });
    this.countdownNumberElement = countdownNumber;
    countdownContainer.appendChild(countdownNumber);
    countdownSection.appendChild(countdownContainer);
  }

  public update(player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;
    this.player1NicknameElement.textContent = player1.nickname;
    this.player1NicknameElement.style.color = player1.color || '#0000FF';
    this.player2NicknameElement.textContent = player2.nickname;
    this.player2NicknameElement.style.color = player2.color || '#FF0000';
    if (player1.nickname.length + player2.nickname.length > 30) {
      this.matchupSection.classList.add('flex-col');
    } else {
      this.matchupSection.classList.remove('flex-col');
    }
  }

  public show(player1?: Player, player2?: Player): void {
    // Logger.debug('MatchAnnouncement.show() called with:');
    // Logger.debug('player1:', player1);
    // Logger.debug('player2:', player2);
    this.element.style.display = 'flex';
    if (player1 && player2) {
      this.update(player1, player2);
    }
    this.startCountdown();
  }

  public hide(): void {
    this.element.style.display = 'none';
  }

  public remove(): void {
    if (this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
  }

  private startCountdown() {
    let secondsLeft = this.countdownSeconds;
    this.updateCountdownDisplay(secondsLeft);
    const countdownInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
        this.updateCountdownDisplay(0);
        this.hide();
      } else {
        this.updateCountdownDisplay(secondsLeft);
      }
    }, 1000);
  }

  private updateCountdownDisplay(seconds: number) {
    this.countdownNumberElement.textContent = seconds.toString();
  }
}
