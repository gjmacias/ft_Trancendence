import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

const playerNicknameInputLabel = createNicknameInputLabel();
const playerNicknameInputField = createNicknameInputField();

export default function createNicknameInput(): HTMLLabelElement {
  playerNicknameInputLabel.appendChild(playerNicknameInputField);
  return playerNicknameInputLabel;
}

export function getNicknameInputField(): HTMLInputElement {
  return playerNicknameInputField;
}
export function getNicknameInputLabel(): HTMLLabelElement {
  return playerNicknameInputLabel;
}

function createNicknameInputLabel(): HTMLLabelElement {
  const playerNicknameInputLabel = MyHtml.label({
    text: langTools.getText('tournament.player-name-label'),
    class: `player-nickname-label
    mb-4
    block
    text-lg
    font-medium`,
    id: 'player-nickname-label',
    for: 'player-nickname'
  });
  return playerNicknameInputLabel;
}

function createNicknameInputField(): HTMLInputElement {
  const playerNicknameInputField = MyHtml.input({
    type: 'text',
    class: `player-nickname-input
    inset-1
    w-full
    rounded-md
    border
    bg-white
    px-3
    py-2
    text-lg
    focus:ring-2
    focus:ring-blue-500
    focus:outline-none`,
    id: 'player-nickname-input-field',
    placeholder: langTools.getText('tournament.player-name-placeholder')
  });
  playerNicknameInputField.addEventListener('keydown', (event: KeyboardEvent) => {
    if (playerNicknameInputField.value.length === 0) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      playerNicknameInputField.blur();
      const colorPickerInput = document.getElementById('color-picker-input') as HTMLInputElement;
      colorPickerInput.click();
    }
  });
  return playerNicknameInputField;
}
