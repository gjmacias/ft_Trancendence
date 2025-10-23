import { routes } from '@/render';
import { root } from '@/main';
import API_ROUTES from '@utils/api.routes';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

type UserStatus = 'logged_in' | 'logged_out' | '2fa_required';

async function checkStatus(): Promise<UserStatus> {
  try {
    const response = await fetch(API_ROUTES.AUTH.STATUS, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      const { qr2fa } = data;
      if (response.status === 200) {
        localStorage.removeItem('2FA_QR');
        return 'logged_in';
      } else if (response.status === 210) {
        localStorage.setItem('2FA_QR', qr2fa);
        return '2fa_required';
      } else if (response.status === 211) {
        localStorage.removeItem('2FA_QR');
        return '2fa_required';
      } else if (response.status === 212) {
        return 'logged_out';
      }
    }
    throw new Error(`Received status: ${response.status}, ${response.statusText}`);
  } catch (error) {
    Logger.error('Error checking status:', error);
  }
  localStorage.removeItem('2FA_QR');
  return 'logged_out';
}

export default async function router() {
  const path = window.location.pathname;
  // Logger.debug('router(); path:', path);
  const userStatus = await checkStatus();
  // Logger.debug('user status:', userStatus);
  let route = routes[path];
  langTools.initUserLanguage();

  if (userStatus === '2fa_required' && path !== '/verify') {
    window.history.pushState({}, '', '/verify');
    route = routes['/verify'];
  }
  if (userStatus === 'logged_in' && (path === '/login' || path === '/signup' || path === '/verify')) {
    window.history.pushState({}, '', '/play');
    route = routes['/play'];
  }
  if (userStatus === 'logged_out' && path !== '/login' && path !== '/signup') {
    window.history.pushState({}, '', '/login');
    route = routes['/login'];
  }

  if (route) {
    route(root);
  } else {
    Logger.warn(`No route found for page: ${path}`); // TODO: Possible feature, handle 404 or unknown page
  }
}
