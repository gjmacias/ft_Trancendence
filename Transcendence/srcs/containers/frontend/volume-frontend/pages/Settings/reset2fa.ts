import MyHtml from '@utils/MyHtml3';
import { API_ROUTES } from '@utils/api.routes';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';
import showAlert from '@components/showAlert';

export default function create2FAResetButton() {
  const resetButton = MyHtml.button({
    class: `reset-button
    px-4
    py-2
    font-semibold
    text-white
    rounded-md
    bg-red-500
    hover:bg-red-700`,
    text: langTools.getText('profile.reset-button'),
  });
  resetButton.addEventListener('click', reset2FAClickHandler);
  return resetButton;
}

async function reset2FAClickHandler() {
  try {
    const response = await fetch(API_ROUTES.UPDATE.DELETE_2FA_SECRET, {
      method: 'POST',
      credentials: 'include'
    });
    if (response.ok) {
      showAlert(langTools.getText('profile.alert-2fa-reset-success'));
    }
  } catch (error) {
    Logger.error('Error resetting 2FA:', error);
  }
}
