export type InputRole =
  | "health"
  | "game"
  | "tournament"
  | "starter";

export type HealthCommand =
  | "PING"
  | "imReady";

export type GameCommand =
  | "startGoUp"
  | "startGoDown"
  | "stopGoUp"
  | "stopGoDown"
  | "powerUp1"
  | "powerUp2"
  | "powerUp3"
  | "startGoUpPlayer2"
  | "startGoDownPlayer2"
  | "stopGoUpPlayer2"
  | "stopGoDownPlayer2"
  | "powerUp1Player2"
  | "powerUp2Player2"
  | "powerUp3Player2"
  | "imReady";

export type TournamentCommand =
  | "imReady";

export type CommandsByRole = {
  health: HealthCommand;
  game: GameCommand;
  tournament: TournamentCommand;
  starter: string;
};

export type InputEvent<R extends InputRole = InputRole> = {
  playerId: string; // Only needed server-side
  type: R;
  command: CommandsByRole[R];
  timestamp?: number;
};
