import MyHtml from '@utils/MyHtml3';
import Tooltip from '@pages/SignUp/tooltip';
import { profileData } from './profileData';
import { nicknameCancelButtonEventHandler, nicknameMainButtonEventHandler } from './nicknameInput';
import { passwordCancelButtonEventHandler, passwordMainButtonEventHandler } from './passwordInput';
import langTools from '@utils/LanguageTools';

export default function createDataContainer(dataType: 'nickname' | 'password'): HTMLElement {
  const container = MyHtml.div({
    class: `grid
    w-220
    grid-cols-[auto_auto_minmax(440px,1fr)_auto]
    items-center
    gap-4
    my-2
    mx-2
    p-2`
  });
  const cancelButton = createCancelButton(dataType);
  container.appendChild(cancelButton);
  const label = createLabel(dataType);
  container.appendChild(label);
  let inputBox: HTMLElement;
  if (dataType === 'nickname') {
    inputBox = createNicknameInputBox();
  } else {
    inputBox = createPasswordInputBox();
  }
  container.appendChild(inputBox);
  const button = createSubmitButton(dataType);
  container.appendChild(button);
  const tooltip = Tooltip.createTooltip(0, dataType as string);
  MyHtml.setAttributes(tooltip, {
    class: `<+>
    translate-x-[525px]
    <->
    translate-x-[260px]`
  });
  container.appendChild(tooltip);
  if (dataType === 'nickname') {
    profileData.nicknameContainer = container;
    profileData.tooltip.nickname = tooltip;
  } else if (dataType === 'password') {
    profileData.passwordContainer = container;
    profileData.tooltip.password = tooltip;
  }
  return container;
}

function createCancelButton(dataType: 'nickname' | 'password'): HTMLElement {
  const cancelButton = MyHtml.button({
    class: `cancel-button
    bg-red-700
    text-white
    text-md
    px-4
    py-2
    mr-4
    rounded
    hover:bg-red-800
    transition-colors
    duration-150
    active:bg-red-900
    active:scale-95`,
    type: 'button',
    ariaLabel: 'Cancel Update',
    text: langTools.getText('profile.cancel-button'),
  });
  MyHtml.setAttributes(cancelButton, profileData.attr.cancel.disabled);
  cancelButton.addEventListener('click',
    dataType === 'nickname' ? nicknameCancelButtonEventHandler :
      passwordCancelButtonEventHandler
  );
  return cancelButton;
}

function createLabel(dataType: 'nickname' | 'password'): HTMLElement {
  if (dataType === 'nickname') {
    const title = MyHtml.h2(langTools.getText('profile.nickname-label'), {
      class: `nickname-label
      w-36
      text-2xl
      font-bold
      mr-4`
    });
    return title;
  } else if (dataType === 'password') {
    const title = MyHtml.h2(langTools.getText('profile.password-label'), {
      class: `password-label
      w-36
      text-2xl
      font-bold
      mr-4`
    });
    return title;
  }
}

function createNicknameInputBox(): HTMLElement {
  const nickname = profileData.currentNickname;
  const inputBox = MyHtml.input({
    class: `text-lg
    font-['Press_Start_2P']
    border
    border-none outline-none
    rounded-lg
    py-4 px-3
    max-w-md`,
    type: 'text',
    placeholder: nickname,
    ariaLabel: 'nickname'
  });
  MyHtml.setAttributes(inputBox, profileData.attr.input.disabled);
  return inputBox;
}

function createPasswordInputBox(): HTMLElement {
  const inputBox = MyHtml.input({
    class: `text-lg
    font-['Press_Start_2P']
    border
    border-none outline-none
    rounded-lg
    py-4 px-3
    max-w-md`,
    type: 'password',
    placeholder: '*******',
    ariaLabel: 'password'
  });
  MyHtml.setAttributes(inputBox, profileData.attr.input.disabled);
  return inputBox;
}

function createSubmitButton(dataType: 'nickname' | 'password'): HTMLElement {
  const button = MyHtml.button({
    class: `submit-button
    bg-blue-500
    text-white
    text-lg
    font-semibold
    w-40
    px-4
    py-2
    mx-4
    rounded
    hover:bg-blue-600
    transition-colors
    duration-300
    active:bg-blue-700
    active:scale-95`,
    type: 'button',
    ariaLabel: langTools.getText('profileData.submit-button-edit'),
    text: langTools.getText('profileData.submit-button-edit')
  });
  MyHtml.setAttributes(button, profileData.attr.button.editMode);
  button.addEventListener('click',
    dataType === 'nickname' ? nicknameMainButtonEventHandler :
      passwordMainButtonEventHandler
  );
  return button;
}
