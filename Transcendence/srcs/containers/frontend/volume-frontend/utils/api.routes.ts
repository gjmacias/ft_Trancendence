export const API_ROUTES = {
  AUTH: {
    LOGIN: '/backend/auth/login',
    LOGOUT: '/backend/auth/logout',
    SIGNUP: '/backend/auth/register',
    STATUS: '/backend/auth/status',
    CHECK_LOGGED_IN: '/backend/auth/status',
    REFRESH_TOKEN: '/backend/auth/refresh-token',
    CALLBACK_2FA: '/backend/auth/2FA/callback',
    WATCH_NICKNAME: (nickname: string) => `/backend/auth/nickname/${nickname}`,
    WATCH_EMAIL: (email: string) => `/backend/auth/email/${email}`,
    GOOGLE: '/backend/auth/google',
    FORTYTWO: '/backend/auth/42',
    GET_2FA_STATE: '/backend/auth/2fa-enabled',
  },
  UPDATE: {
    PASSWORD: '/backend/auth/update/password',
    NICKNAME: '/backend/auth/update/nickname',
    PHOTO: '/backend/auth/update/photo',
    IS_ACTIVE: '/backend/auth/update/active',
    TOGGLE_2FA: '/backend/auth/update/active2FA',
    DELETE_2FA_SECRET: '/backend/auth/update/delete-2FA-Secret',
    DELETE_INFORMATION: '/backend/auth/update/delete-your-information',
    GET_USER_INFORMATION: '/backend/auth/update/get-your-information',
    PRIVATE_COUNT: '/backend/auth/update/privateCount'
  },
  GAME: {
    START: (mode: string) => `/game/1v1/${mode}`,
    WEBSOCKET: '/game/wss',
    RECONNECT: '/game/reconnect',
    TOURNAMENT: '/game/tournament',
    CONNECT_REMOTE: '/game/connect-remote',
    START_REMOTE: '/game/start-remote'

  },
  TOURNAMENT: {
    START: '/game/tournament',
    BLOCKCHAIN: (tournamentId: string) => `/backend/blockchain/tournament/${tournamentId}`
  }
};

export default API_ROUTES;
