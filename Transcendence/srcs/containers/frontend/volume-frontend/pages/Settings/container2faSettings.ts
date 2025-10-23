import MyHtml from '@utils/MyHtml';
import create2FASettingItem from './element2faSettings';
import create2FAToggle from './toggle2fa';
import create2FAResetButton from './reset2fa';
import langTools from '@utils/LanguageTools';

export default async function create2FASettingsContainer() {
  // Container for 2FA settings
  const settingsContainer = MyHtml.div(
    `flex
    flex-col
    gap-4
    p-4`,
    '@id:settings2fa'
  );
  // Title for the 2FA settings
  const title = MyHtml.textElement(
    'h2',
    langTools.getText('profile.two-factor-title'),
    `two-factor-title
    text-3xl
    font-bold`
  );
  settingsContainer.appendChild(title);
  const toggle2FA = create2FASettingItem(
    langTools.getText('profile.two-factor-setting-label-enabled'),
    await create2FAToggle()
  );
  settingsContainer.appendChild(toggle2FA);
  const reset2FA = create2FASettingItem(
    langTools.getText('profile.two-factor-setting-label-reset'),
    await create2FAResetButton()
  );
  settingsContainer.appendChild(reset2FA);
  return settingsContainer;
}
