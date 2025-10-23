import Tooltip from '@pages/SignUp/tooltip';
import { API_ROUTES } from '@utils/api.routes';
import { toggleMode } from './toggleMode';
import { profileData } from './profileData';
import { validatePassword } from './validations';
import MyHtml from '@utils/MyHtml3';
import Logger from '@utils/Logger';
import langTools from '@utils/LanguageTools';

export function passwordCancelButtonEventHandler(event: Event) {
  event.preventDefault();
  // Logic to cancel the update
  toggleMode('password');
}

export function passwordMainButtonEventHandler(event: Event) {
  event.preventDefault();
  if (profileData.mode.password === 'view') {
    editPasswordButtonEventHandler(event);
  } else if (profileData.mode.password === 'edit') {
    submitPasswordButtonEventHandler(event);
  } else {
    Logger.error('Unknown mode:', profileData.mode.password);
    return;
  }
}

function editPasswordButtonEventHandler(event: Event) {
  event.preventDefault();
  toggleMode('password');
}

async function submitPasswordButtonEventHandler(event: Event) {
  event.preventDefault();
  const passwordInput = profileData.passwordContainer.querySelector('input') as HTMLInputElement;
  const password = passwordInput.value.trim();
  const tooltip = profileData.tooltip.password;

  // Validate the password here and show errors if necessary
  if (!validatePassword(password, tooltip)) {
    return;
  }

  // If every check went well, update the password
  if (await updatePassword(password)) {
    toggleMode('password');
    MyHtml.setAttributes(tooltip, {
      class: '<+> text-green-500 font-bold <-> text-black',
    });
    Tooltip.showTooltip(tooltip, langTools.getText('profile.password-update-success'));
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
    Tooltip.showTooltip(tooltip, langTools.getText('profile.password-update-fail'));
    setTimeout(() => {
      MyHtml.setAttributes(tooltip, {
        class: '<-> text-red-500 font-bold <+> text-black',
        text: ''
      });
      Tooltip.hideTooltip(tooltip);
    }, 2000);
  }
  passwordInput.value = '';
}

async function updatePassword(password: string): Promise<boolean> {
  try {
    const url = API_ROUTES.UPDATE.PASSWORD;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });
    if (response.status === 200) {
      return true;
    } else {
      Logger.error('Failed to update password:', response.status);
      Tooltip.showTooltip(profileData.tooltip.password, langTools.getText('profile.password-update-fail'));
    }
  } catch (error) {
    Logger.error('Error updating password:', error);
  }
  return false;
}
