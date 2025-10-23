import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

import createSidebarDivider from './sidebar.divider';

export default function createSidebarFooter(): HTMLElement {
  const footer = MyHtml.div({
    class: 'footer mt-auto'
  });
  footer.appendChild(createSidebarDivider());

  const buttonContainer = MyHtml.div({
    class: 'button-container flex justify-around pt-4'
  });

  buttonContainer.appendChild(createGithubButton());
  buttonContainer.appendChild(createLogoutButton());
  buttonContainer.appendChild(createLanguageSelector());

  footer.appendChild(buttonContainer);
  return footer;
}

function createGithubButton(): HTMLElement {
  const button = MyHtml.button({
    class: `flex
    items-center justify-center
    gap-0.5
    p-0.5 pr-1.5
    bg-neutral-200
    text-neutral-950
    text-sm
    rounded-full
    border-2 border-neutral-950
    hover:bg-neutral-200
    hover:text-blue-600
    hover:border-blue-600
    transition-colors
    duration-300`,
    id: 'github-button'
  });
  const svgIcon = MyHtml.svgIcon({
    href: 'github',
    height: '28',
    width: '28'
  });
  button.appendChild(svgIcon);
  const iconLabel = MyHtml.span('GitHub');
  button.appendChild(iconLabel);
  button.addEventListener('click', (event) => {
    event.preventDefault();
    window.open('https://github.com/gjmacias/Transcendence', '_blank');
  });
  return button;
}

export function createLogoutButton(): HTMLButtonElement {
  const button = MyHtml.button({
    class: `group
    flex
    items-center
    p-2
    gap-1
    text-sm
    hover:bg-white/10
    rounded-sm
    hover:text-red-500
    hover:drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]
    transition-colors
    duration-150`,
    id: 'logout-button',
    ariaLabel: 'Logout'
  });

  const svgIcon = MyHtml.svgIcon({
    href: 'logout',
    height: '24',
    width: '24'
  });
  button.appendChild(svgIcon);

  const iconLabel = MyHtml.span(langTools.getText('sidebar.logout'), {
    class: `logout-button text-white`
  });
  button.appendChild(iconLabel);

  button.addEventListener('click', logoutEventHandler);

  return button;
}

function createLanguageSelector(): HTMLSelectElement {
  return langTools.createLanguageSelector();
}

// TODO: Move these kind of things to a separate file like Galo suggested
import Navigator from '@/Navigator';
import API_ROUTES from '@utils/api.routes';
import showAlert from '@components/showAlert';
async function logoutEventHandler(event: Event) {
  event.preventDefault();
  Logger.debug('Logout button clicked');
  const response = await fetch(API_ROUTES.AUTH.LOGOUT, {
    method: 'POST',
    credentials: 'include',
  });
  Logger.debug('Logout response:', response);
  if (response.status === 200) {
    localStorage.removeItem('nickname');
    Logger.debug('User logged out successfully');
    Navigator.navigate('/login');
  } else {
    Logger.error('Error logging out:', response.statusText);
    showAlert(langTools.getText('sidebar.alert-logout-error'));
  }
}
