import loginRender from '@pages/Login/login.page';
import playMenuRender from '@pages/Play/play.page';
import signupRender from '@pages/SignUp/signup.page';
import verifyPageRender from '@pages/Verify/verify.page';
import tournamentRender from '@pages/Tournament/tournament.page';
import settingsRender from '@pages/Settings/settings.page';

type RouteHandler = (root: HTMLElement) => void;

export const routes: Record<string, RouteHandler> = {
  '': (root) => playMenuRender(root),
  '/': (root) => playMenuRender(root),
  '/login': (root) => loginRender(root),
  '/signup': (root) => signupRender(root),
  '/verify': (root) => verifyPageRender(root),
  '/play': (root) => playMenuRender(root),
  '/tournament': (root) => tournamentRender(root),
  '/settings': (root) => settingsRender(root),
};
