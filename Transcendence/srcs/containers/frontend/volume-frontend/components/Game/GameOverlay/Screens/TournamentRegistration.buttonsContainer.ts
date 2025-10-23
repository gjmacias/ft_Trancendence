import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

import { getColorPickerInput, getColorTextInput } from './TournamentRegistration.colorInput';
import { getNicknameInputField, getNicknameInputLabel } from './TournamentRegistration.nicknameInput';
import { getRegistryBox } from './TournamentRegistration.registryBox';
import { getRegisteredPlayersDisplayBackground } from './TournamentRegistration.registeredDisplay';
import startTournamentService from './startTournament.service';
import { game } from '@components/Game/Game';
import showAlert from '@components/showAlert';

let registry: { nickname: string; color: string }[] = [];

const buttonClasses: string = `button
  w-full
  rounded-md
  p-2
  text-white
  font-semibold
  transition-colors`;
const addButtonClasses: string = buttonClasses + ' ' +
  `bg-blue-600
  hover:bg-blue-700`;
const startButtonClasses: string = buttonClasses + ' ' +
  `bg-green-600
  hover:bg-green-700`;

export default function createButtonsContainer(): HTMLDivElement {
  const buttonContainer = MyHtml.div({
    class: `button-container
    flex
    gap-4
    justify-center`,
    id: 'buttons-container'
  });
  const addButton = createAddButton();
  buttonContainer.appendChild(addButton);
  const startButton = createStartButton();
  buttonContainer.appendChild(startButton);
  return buttonContainer;
}

function createAddButton(): HTMLButtonElement {
  const addButton = MyHtml.button({
    text: langTools.getText('tournament.add-player-button'),
    class: addButtonClasses,
    id: 'add-player-button'
  });
  addButton.addEventListener('click', addButtonEventHandler);
  return addButton;
}

function createStartButton(): HTMLButtonElement {
  const startButton = MyHtml.button({
    text: langTools.getText('tournament.start-tournament-button'),
    class: startButtonClasses,
    id: 'start-tournament-button'
  });
  startButton.addEventListener('click', startButtonEventHandler);
  return startButton;
}

function addButtonEventHandler() {
  const playerNicknameInputField = getNicknameInputField();
  const colorTextInput = getColorTextInput();
  const colorPickerInput = getColorPickerInput();
  const registryBox = getRegistryBox();
  const registeredPlayersDisplayBackground = getRegisteredPlayersDisplayBackground();
  const nickname = playerNicknameInputField.value.trim();
  const color = colorPickerInput.value;

  if (nickname.length === 0) {
    showshowAlert(langTools.getText('tournament.alert-missing-alias'));
    return;
  }

  if (!addPlayerToRegistry(nickname, color)) {
    return;
  }

  if (registeredPlayersDisplayBackground) {
    // Logger.info('Adding player to registry: ' + nickname + ' with color ' + color);
    const playerBall = createPlayerBall(nickname, color);
    registeredPlayersDisplayBackground.appendChild(playerBall);
  }

  playerNicknameInputField.value = '';
  colorTextInput.value = '';
  colorPickerInput.value = '#808080';
  registryBox.style.backgroundColor = '#f0f0f0';

  playerNicknameInputField.focus();
}

//////////////// TODO: MOVE TO A SERVICE OR SOMETHING
async function startButtonEventHandler() {
  if (registry.length === 0) {
    showAlert(langTools.getText('tournament.alert-no-players'));
    return;
  }
  Logger.debug('Submitting tournament registry: ' + registry);
  const tournamentRegistryMessage = {
    mode: 'local',
    users: registry
  }
  if (await game.startTournament(tournamentRegistryMessage) === false) {
    showAlert(langTools.getText('tournament.alert-registration-fail'));
    return;
  }
  clearRegistry();
}

function clearRegistry() {
  registry = [];
}

function addPlayerToRegistry(nickname: string, color: string): boolean {
  if (registry.find(player => player.nickname === nickname)) {
    showAlert(langTools.getText('tournament.alert-duplicate-alias'));
    return false;
  }
  // Logger.info('Player added to registry: ' + nickname + ' with color ' + color);
  registry.push({ nickname, color });
  return true;
}


function createPlayerBall(nickname: string, color: string): HTMLDivElement {
  const playerWrapper = MyHtml.div({
    class: `player-wrapper
    relative
    size-[140px]
    hover:scale-105
    hover:cursor-pointer
    transition-all
    flex-none`,
  });
  playerWrapper.addEventListener('click', () => playerWrapperClickHandler(playerWrapper, nickname));
  const playerBall = MyHtml.div({
    class: `player-ball
    relative
    flex
    size-[140px]
    rounded-full
    items-center
    justify-center
    overflow-hidden`,
    style: `background-color: ${color};`
  });
  playerWrapper.appendChild(playerBall);
  const playerBallLighting = MyHtml.div({
    class: `player-ball-lighting
    absolute
    top-0 left-2/5
    size-40
    rounded-full
    bg-white/30
    blur-2xl`
  });
  playerBall.appendChild(playerBallLighting);
  const playerNicknameLabel = MyHtml.span(nickname, {
    class: `player-nickname
    absolute
    text-center
    bg-black/30
    rounded-md
    font-semibold
    p-2
    text-white`
  });
  playerBall.appendChild(playerNicknameLabel);
  return playerWrapper;
}

function playerWrapperClickHandler(playerWrapper: HTMLElement, nickname: string): void {
  // FLIP animation for smooth reordering
  const container = playerWrapper.parentElement;
  if (container) {
    const wrappers = Array.from(container.children) as HTMLElement[];
    const firstRects = wrappers.map(w => w.getBoundingClientRect());

    registry = registry.filter(player => player.nickname !== nickname);

    playerWrapper.style.transition = 'transform 0.3s, opacity 0.3s';
    playerWrapper.style.transform = 'scale(0)';
    playerWrapper.style.opacity = '0';

    setTimeout(() => {
      const removedIndex = wrappers.indexOf(playerWrapper);
      playerWrapper.remove();
      const newWrappers = Array.from(container.children) as HTMLElement[];
      const lastRects = newWrappers.map(w => w.getBoundingClientRect());
      newWrappers.forEach((w, i) => {
        // Only animate if this wrapper was after the removed one
        if (i >= removedIndex) {
          const dx = firstRects[i + 1]?.left - lastRects[i].left || 0;
          const dy = firstRects[i + 1]?.top - lastRects[i].top || 0;
          w.style.transition = 'none';
          w.style.transform = `translate(${dx}px, ${dy}px)`;
          w.getBoundingClientRect();
          w.style.transition = 'transform 0.3s';
          w.style.transform = '';
        }
      });
    }, 300);
  } else {
    playerWrapper.remove();
  }
}
