import KeyPress from './KeyPress';

const keyW = new KeyPress('w', 'startGoUp', 'stopGoUp');
const keyS = new KeyPress('s', 'startGoDown', 'stopGoDown');
const keyArrowUp = new KeyPress('ArrowUp', 'startGoUpPlayer2', 'stopGoUpPlayer2');
const keyArrowDown = new KeyPress('ArrowDown', 'startGoDownPlayer2', 'stopGoDownPlayer2');

export function keydownEventHandler(event: KeyboardEvent) {
  event.preventDefault();
  switch (event.key) {
    case 'w':
    case 'W':
      keyW.press();
      break;
    case 'ArrowUp':
      keyArrowUp.press();
      break;
    case 's':
    case 'S':
      keyS.press();
      break;
    case 'ArrowDown':
      keyArrowDown.press();
      break;
  }
}

export function keyupEventHandler(event: KeyboardEvent) {
  event.preventDefault();
  switch (event.key) {
    case 'w':
    case 'W':
      keyW.release();
      break;
    case 'ArrowUp':
      keyArrowUp.release();
      break;
    case 's':
    case 'S':
      keyS.release();
      break;
    case 'ArrowDown':
      keyArrowDown.release();
      break;
  }
}
