import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

import createNicknameInput from './TournamentRegistration.nicknameInput';
import createColorPickerInput from './TournamentRegistration.colorInput';
import createButtonsContainer from './TournamentRegistration.buttonsContainer';

const registryBox = MyHtml.div({
  class: `registry-box
    flex-shrink-0
    self-center
    min-w-max
    mb-2
    p-6
    bg-gray-200
    rounded-lg
    shadow-md
    text-black
    transition-colors
    duration-300`,
  id: 'registry-box'
});
export function getRegistryBox(): HTMLElement {
  return registryBox;
}

export default function createRegistryBox(): HTMLElement {
  const registryTitle = MyHtml.h2(langTools.getText('tournament.registry-title'), {
    class: `registry-title
    mb-4
    text-2xl
    font-bold`,
    id: 'registry-title'
  });
  registryBox.appendChild(registryTitle);

  const playerNicknameInputLabel = createNicknameInput();
  registryBox.appendChild(playerNicknameInputLabel);

  const colorPickerInput = createColorPickerInput(registryBox);
  registryBox.appendChild(colorPickerInput);

  const buttonContainer = createButtonsContainer();
  registryBox.appendChild(buttonContainer);

  return registryBox;
}
