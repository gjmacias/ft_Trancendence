import { gameWebSocket } from "@components/Game/GameWebSocket";
import { GameCommand } from "./types";
import { InputEvent } from "./types";
import Logger from "@utils/Logger";

export default class KeyPress {
  key: string;
  pressed: boolean;
  pressInput: GameCommand;
  releaseInput: GameCommand;

  constructor(key: string, pressInput: GameCommand, releaseInput: GameCommand) {
    this.key = key;
    this.pressed = false;
    this.pressInput = pressInput;
    this.releaseInput = releaseInput;
  }

  public press() {
    if (this.pressed) {
      return;
    }
    this.pressed = true;
    this.sendInputEvent(this.pressInput, Date.now());
  }
  public release() {
    if (!this.pressed) {
      return;
    }
    this.pressed = false;
    this.sendInputEvent(this.releaseInput, Date.now());
  }

  private sendInputEvent(command: GameCommand, timestamp?: number) {
    if (gameWebSocket.isActive() === false) {
      return;
    }
    const type = 'game';
    // Logger.debug(`Sending input: ${command} as ${type} at ${timestamp}`);
    const inputEvent = { type, command, timestamp } as InputEvent;
    gameWebSocket.send(inputEvent);
  }
}

