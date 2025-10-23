import Tooltip from '@pages/SignUp/tooltip';
import { isNicknameTaken } from '@pages/SignUp/signupApi';
import { API_ROUTES } from '@utils/api.routes';
import { toggleMode } from './toggleMode';
import { profileData } from './profileData';
import { validateNickname } from './validations';
import MyHtml from '@utils/MyHtml3';
import Logger from '@utils/Logger';
import langTools from '@utils/LanguageTools';

export function nicknameCancelButtonEventHandler(event: Event) {
  event.preventDefault();
  toggleMode('nickname');
}

export function nicknameMainButtonEventHandler(event: Event) {
  event.preventDefault();
  if (profileData.mode.nickname === 'view') {
    editNicknameButtonEventHandler(event);
  } else if (profileData.mode.nickname === 'edit') {
    submitNicknameButtonEventHandler(event);
  } else {
    Logger.error('Unknown mode:', profileData.mode.nickname);
    return;
  }
}

function editNicknameButtonEventHandler(event: Event) {
  event.preventDefault();
  toggleMode('nickname');
}

async function submitNicknameButtonEventHandler(event: Event) {
  event.preventDefault();
  const nicknameInput = profileData.nicknameContainer.querySelector('input') as HTMLInputElement;
  const nickname = nicknameInput.value.trim();
  const tooltip = profileData.tooltip.nickname;

  // Validate the nickname here and show errors if necessary
  if (!validateNickname(nickname, tooltip)) {
    return;
  }

  if (nickname === profileData.currentNickname) {
    MyHtml.setAttributes(tooltip, {
      class: '<+> text-yellow-500 font-bold <-> text-black',
    });
    Tooltip.showTooltip(tooltip, langTools.getText('profile.nickname-same-as-current'));
    setTimeout(() => {
      MyHtml.setAttributes(tooltip, {
        class: '<-> text-yellow-500 font-bold <+> text-black',
        text: ''
      });
      Tooltip.hideTooltip(tooltip);
    }, 2000);
    return;
  }

  // Check if the nickname is already taken
  if (await isNicknameTaken(nickname)) {
    Tooltip.showTooltip(tooltip, langTools.getText('signup.nickname-taken'));
    return;
  }

  // If every check went well, update the nickname
  if (await updateNickname(nickname)) {
    localStorage.setItem('nickname', nickname);
    profileData.currentNickname = nickname;
    nicknameInput.placeholder = nickname;
    toggleMode('nickname');
    MyHtml.setAttributes(tooltip, {
      class: '<+> text-green-500 font-bold <-> text-black',
    });
    Tooltip.showTooltip(tooltip, langTools.getText('profile.nickname-update-success'));
    setTimeout(() => {
      MyHtml.setAttributes(tooltip, {
        class: '<-> text-green-500 font-bold <+> text-black',
        text: ''
      });
      Tooltip.hideTooltip(tooltip);
    }, 2000);
  } else {
    MyHtml.setAttributes(tooltip, {
      class: '<+> text-red-500 font-bold <-> text-black',
    });
    Tooltip.showTooltip(tooltip, 'Failed to update nickname');
    setTimeout(() => {
      MyHtml.setAttributes(tooltip, {
        class: '<-> text-red-500 font-bold <+> text-black',
        text: ''
      });
      Tooltip.hideTooltip(tooltip);
    }, 2000);
  }
  nicknameInput.value = '';
}

async function updateNickname(nickname: string): Promise<boolean> {
  try {
    const url = API_ROUTES.UPDATE.NICKNAME;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nickname })
    });
    if (response.status === 200) {
      return true;
    } else {
      Logger.error('Failed to update nickname:', response.status);
      Tooltip.showTooltip(profileData.tooltip.nickname, langTools.getText('profile.nickname-update-fail'));
    }
  } catch (error) {
    Logger.error('Error updating nickname:', error);
  }
  return false;
}
