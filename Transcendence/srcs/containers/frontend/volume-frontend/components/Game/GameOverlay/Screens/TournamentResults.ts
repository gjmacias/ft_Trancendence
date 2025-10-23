import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Screen from './Screen';
import Logger from '@utils/Logger';
import Button from '@components/Button';

import { Player } from '../../Models/Player';

export let blockchainButton: Button | null = null;

type Results = {
  winner: Player;
  runnerUp: Player;
  participants: Player[];
}

export default class TournamentResults extends Screen {
  private winnerContainer: HTMLDivElement;
  private winner: HTMLSpanElement;
  private runnerUpContainer: HTMLDivElement;
  private runnerUp: HTMLSpanElement;
  private participants: HTMLDivElement;

  constructor() {
    super();
    this.createTournamentResultsScreen();
    this.hide();
  }

  public update(results: Results) {
    if (!results || !results.winner || !results.runnerUp || !results.participants) {
      Logger.error('Invalid results data provided to TournamentResults screen.');
      return;
    }
    this.addWinner(results.winner);
    this.addRunnerUp(results.runnerUp);
    for (let i = 0; i < results.participants.length; i++) {
      this.addParticipant(results.participants[i]);
    }
  }

  public show(results: Results) {
    this.update(results);
    this.element.style.display = 'flex';
    this.adjustWinnerFontSize();
    this.adjustRunnerUpFontSize();
  }

  private createTournamentResultsScreen() {
    const tournamentResultsScreen = MyHtml.div({
      class: `tournament-results-screen flex h-full w-full flex-col items-center bg-black p-4 min-h-0`,
      id: 'tournament-results-screen'
    });
    this.element = tournamentResultsScreen;
    const title = this.createTitle();
    tournamentResultsScreen.appendChild(title);
    const resultsContents = this.createResultsContents();
    tournamentResultsScreen.appendChild(resultsContents);
  }

  private createTitle(): HTMLElement {
    const titleContainer = MyHtml.div({
      class: 'title-container m-2 mb-3'
    });
    const title = MyHtml.h1(langTools.getText('overlay.tournament-results-title'), {
      class: 'title text-7xl font-semibold'
    });
    titleContainer.appendChild(title);
    return titleContainer;
  }

  private createResultsContents(): HTMLDivElement {
    const resultsContents = MyHtml.div({
      class: 'results-contents flex h-full w-full min-h-0'
    });
    const finalists = this.createFinalists();
    resultsContents.appendChild(finalists);
    const remainingParticipants = this.createRemainingParticipants();
    resultsContents.appendChild(remainingParticipants);
    return resultsContents;
  }

  private createFinalists(): HTMLDivElement {
    const finalists = MyHtml.div({
      class: 'relative finalists flex h-full w-2/3 flex-col space-y-2'
    });
    const winner = this.createWinner();
    finalists.appendChild(winner);
    const runnerUp = this.createRunnerUp();
    finalists.appendChild(runnerUp);
    const buttonsContainer = MyHtml.div({
      class: 'buttons-container absolute bottom-5 left-5 flex flex-col items-start justify-between gap-2'
    });
    finalists.appendChild(buttonsContainer);
    const returnButton = this.createReturnButton();
    buttonsContainer.appendChild(returnButton);
    const blockchainButton = this.createBlockchainButton();
    buttonsContainer.appendChild(blockchainButton);
    return finalists;
  }

  private createReturnButton(): HTMLButtonElement {
    const returnButton = MyHtml.button({
      text: langTools.getText('overlay.results-return-button'),
      class: `return-button
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
    return returnButton;
  }

  private createBlockchainButton(): HTMLElement {
    blockchainButton = new Button({
      active: {
        text: langTools.getText('overlay.tournament-blockchain-button.active'),
        class: `blockchain-button-active
        inline-flex
        items-center
        rounded-md
        bg-linear-to-b
        from-purple-500
        to-purple-600
        px-8
        py-4
        text-center
        text-2xl
        font-bold
        text-white
        hover:cursor-pointer
        hover:from-purple-600
        hover:to-purple-700
        hover:shadow-lg
        hover:shadow-white/20
        active:from-purple-700
        active:to-purple-800
        active:shadow-lg
        active:shadow-white/5`,
        type: 'button',
        id: 'blockchain-button'
      },
      inactive: {
        text: langTools.getText('overlay.tournament-blockchain-button.inactive'),
        class: `blockchain-button-inactive
        inline-flex
        animate-pulse
        items-center
        rounded-md
        bg-linear-to-b
        from-purple-300
        to-purple-400
        px-8
        py-4
        text-center
        text-2xl
        font-bold
        text-white
        hover:cursor-progress`,
        type: 'button',
        id: 'blockchain-button'
      }
    }, 'inactive');
    return blockchainButton.getElement();
  }

  private createWinner(): HTMLDivElement {
    const winner = MyHtml.div({
      class: 'winner flex flex-1 flex-col items-center justify-center text-neutral-50'
    });
    this.winnerContainer = winner;
    const winnerTitle = MyHtml.span(langTools.getText('overlay.tournament-winner-title'), {
      class: 'winner-title bg-gradient-to-br from-yellow-200 from-0% via-yellow-100 to-yellow-300 to-100% bg-clip-text text-7xl font-bold text-transparent'
    });
    winner.appendChild(winnerTitle);
    const winnerNickname = MyHtml.span('<nickname>', {
      class: 'winner-nickname w-fit max-w-full overflow-hidden font-semibold'
    });
    winnerNickname.style.fontSize = '8vw';
    this.winner = winnerNickname;
    winner.appendChild(winnerNickname);
    return winner;
  }

  private createRunnerUp(): HTMLDivElement {
    const runnerUp = MyHtml.div({
      class: 'runnerup flex flex-1 flex-col items-center justify-center text-neutral-300'
    });
    this.runnerUpContainer = runnerUp;
    const runnerUpTitle = MyHtml.span(langTools.getText('overlay.tournament-runnerup-title'), {
      class: 'runnerup-title bg-gradient-to-br from-neutral-400 from-0% via-neutral-100 to-neutral-400 to-100% bg-clip-text text-6xl font-bold text-transparent'
    });
    runnerUp.appendChild(runnerUpTitle);
    const runnerUpNickname = MyHtml.span('<nickname>', {
      class: 'runnerup-nickname w-fit max-w-full overflow-hidden font-semibold'
    });
    runnerUpNickname.style.fontSize = '7vw';
    this.runnerUp = runnerUpNickname;
    runnerUp.appendChild(runnerUpNickname);
    return runnerUp;
  }

  private createRemainingParticipants(): HTMLDivElement {
    const remainingParticipants = MyHtml.div({
      class: 'remaining-participants h-full w-1/3'
    });
    const remainingParticipantsList = MyHtml.div({
      class: 'remaining-participants-list flex min-h-0 h-full w-full flex-col space-y-4 overflow-y-auto p-2 text-center text-5xl font-semibold text-neutral-300'
    });
    this.participants = remainingParticipantsList;
    const remainingParticipantsTitle = MyHtml.h1(langTools.getText('overlay.tournament-participants-title'), {
      class: 'remaining-participants-title text-7xl font-bold text-stone-400'
    });
    remainingParticipantsList.appendChild(remainingParticipantsTitle);
    remainingParticipants.appendChild(remainingParticipantsList);
    return remainingParticipants;
  }

  public addWinner(winner: Player) {
    this.winner.textContent = winner.nickname;
    this.winner.style.color = winner.color;
  }
  public addRunnerUp(runnerUp: Player) {
    this.runnerUp.textContent = runnerUp.nickname;
    this.runnerUp.style.color = runnerUp.color;
  }
  public addParticipant(participant: Player) {
    const participantElement = MyHtml.span(participant.nickname, {
      class: 'participant border-2 border-neutral-900/50 w-full'
    });
    participantElement.style.color = participant.color;
    this.participants.appendChild(participantElement);
  }

  private adjustWinnerFontSize() {
    this.adjustFontSize(this.winner, this.winnerContainer, 8, 3);
  }
  private adjustRunnerUpFontSize() {
    this.adjustFontSize(this.runnerUp, this.runnerUpContainer, 7, 2);
  }

  private adjustFontSize(
    textElement: HTMLSpanElement,
    container: HTMLDivElement,
    maxVWSize: number,
    minVWSize: number = 2
  ) {
    const containerWidth = container.offsetWidth;
    if (containerWidth <= 0) return;
    const availableWidth = Math.round(containerWidth * 0.92);

    const textWidth = textElement.scrollWidth;

    if (textWidth > availableWidth) {
      const scaleFactor = availableWidth / textWidth;
      const newFontSize = Math.round(Math.max(minVWSize, maxVWSize * scaleFactor) * 10) / 10;
      textElement.style.fontSize = `${newFontSize}vw`;
    } else {
      textElement.style.fontSize = `${maxVWSize}vw`;
    }
    MyHtml.setAttributes(textElement, {
      class: 'text-ellipsis'
    });
  }

  private sizingCanvas: HTMLCanvasElement | null = null;
  private getTextWidth(text: string, font: string) {
    if (!this.sizingCanvas) {
      this.sizingCanvas = document.createElement('canvas');
    }
    const context = this.sizingCanvas.getContext('2d');
    if (!context) {
      return text.length * 10;
    }
    context.font = font;
    return Math.round(context.measureText(text).width);
  }
}
