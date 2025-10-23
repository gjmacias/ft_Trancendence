import MyHtml from '@utils/MyHtml3';
import createBasicPageLayout from '@components/basicpage.layout';
import createDataContainer from './dataContainer';
import create2FASettingsContainer from './container2faSettings';
import createGdprContainer from './gdprContainer';
import langTools from '@utils/LanguageTools';

export default async function settingsRender(root: HTMLElement) {
  const contentArea = createBasicPageLayout('settings');
  const userDataContainer = MyHtml.div({
    class: `grid
    items-center
    justify-center
    mt-6
    mb-4
    p-2`
  });
  contentArea.appendChild(userDataContainer);
  const userDataText = MyHtml.p(langTools.getText('profile.user-profile-info'), {
    class: `user-profile-info
    text-3xl
    font-bold
    text-center
    mb-4`
  });
  userDataContainer.appendChild(userDataText); 
  const nicknameData = createDataContainer('nickname');
  userDataContainer.appendChild(nicknameData);
  const passwordData = createDataContainer('password');
  userDataContainer.appendChild(passwordData);
  const settings2FA = await create2FASettingsContainer();
  contentArea.appendChild(settings2FA);
  const settingsGDPR = createGdprContainer();
  contentArea.appendChild(settingsGDPR);
}
