import { keydownEventHandler, keyupEventHandler } from './handlers';
import Logger from "@utils/Logger";

export function setupInputListeners() {
  document.addEventListener('keydown', keydownEventHandler);
  document.addEventListener('keyup', keyupEventHandler);
  // Logger.debug('Input listeners set up');
}

export function removeInputListeners() {
  document.removeEventListener('keydown', keydownEventHandler);
  document.removeEventListener('keyup', keyupEventHandler);
  // Logger.debug('Input listeners removed');
}
