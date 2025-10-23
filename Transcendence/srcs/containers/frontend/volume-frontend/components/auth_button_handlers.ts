import API_ROUTES from "@utils/api.routes";
import Logger from "@utils/Logger";

export function authButton42ClickHandler(e: Event) {
  e.preventDefault();
  Logger.debug('42 authentication button clicked');
  const url = API_ROUTES.AUTH.FORTYTWO;
  window.location.href = url;
}

export function authButtonGoogleClickHandler(e: Event) {
  e.preventDefault();
  Logger.debug('Google authentication button clicked');
  const url = API_ROUTES.AUTH.GOOGLE;
  window.location.href = url;
}
