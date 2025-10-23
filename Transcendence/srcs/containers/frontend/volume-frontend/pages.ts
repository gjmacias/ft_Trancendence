import loginRender from '@pages/Login/login.page';
import signupRender from '@pages/SignUp/signup.page';
import verifyPageRender from '@pages/Verify/verify.page';
import playMenuRender from '@pages/Play/play.page';
import tournamentRender from '@pages/Tournament/tournament.page';
import settingsRender from '@pages/Settings/settings.page';

type PermissionLevel = 'guest' | 'f2a' | 'user';

type PageInfo = {
  render: () => void; // Function to render the page
  id: string; // Unique identifier for the page
  inSidebar: boolean; // Whether the page should appear in the sidebar
  permissions: PermissionLevel; // Access permissions
}

export const pages = {
  login: {
    render: loginRender,
    id: 'login',
    inSidebar: false,
    permissions: 'guest'
  },
  signup: {
    render: signupRender,
    id: 'signup',
    inSidebar: false,
    permissions: 'guest'
  },
  verify: {
    render: verifyPageRender,
    id: 'verify',
    inSidebar: false,
    permissions: 'f2a'
  },
  play: {
    render: playMenuRender,
    id: 'play',
    inSidebar: true,
    permissions: 'user'
  },
  tournament: {
    render: tournamentRender,
    id: 'tournament',
    inSidebar: true,
    permissions: 'user'
  },
  settings: {
    render: settingsRender,
    id: 'settings',
    inSidebar: true,
    permissions: 'user'
  }
}
