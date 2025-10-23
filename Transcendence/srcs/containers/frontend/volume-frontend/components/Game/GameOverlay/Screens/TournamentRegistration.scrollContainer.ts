import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

import { getRegisteredPlayersDisplayBackground } from './TournamentRegistration.registeredDisplay';

const scrollButtonClasses: string = `scroll-button
  text-black
  w-[50%]
  h-[60px]
  z-10`;
const scrollLeftButtonClasses: string = scrollButtonClasses + ' ' +
  `mr-[8px]`;
const scrollRightButtonClasses: string = scrollButtonClasses + ' ' +
  `ml-[8px]`;

export default function createScrollContainer(): HTMLDivElement {
  const registeredPlayersDisplayBackground = getRegisteredPlayersDisplayBackground();
  const scrollContainer = MyHtml.div({
    class: `scroll-container
    overflow-x-auto
    whitespace-nowrap
    flex
    justify-center
    mb-6
    w-[200px]
    h-[60px]
    relative`,
    id: 'scroll-container'
  });
  const buttonRow = MyHtml.div({
    class: `button-row
    absolute
    top-0 left-0
    right-0 bottom-0
    flex
    items-center
    justify-center
    w-full
    h-full`,
    id: 'button-row'
  });
  scrollContainer.appendChild(buttonRow);
  const scrollLeftButton = MyHtml.button({
    text: '<',
    class: scrollLeftButtonClasses,
    id: 'scroll-left-button'
  });
  buttonRow.appendChild(scrollLeftButton);
  const scrollRightButton = MyHtml.button({
    text: '>',
    class: scrollRightButtonClasses,
    id: 'scroll-right-button'
  });
  buttonRow.appendChild(scrollRightButton);

  let scrollInterval;

  scrollLeftButton.addEventListener('mousedown', () => {
    scrollInterval = setInterval(() => {
     registeredPlayersDisplayBackground.scrollLeft -= 10;
    }, 16);
  });
  scrollLeftButton.addEventListener('mouseup', () => {
    clearInterval(scrollInterval);
  });
  scrollLeftButton.addEventListener('mouseleave', () => {
    clearInterval(scrollInterval);
  });

  scrollRightButton.addEventListener('mousedown', () => {
    scrollInterval = setInterval(() => {
     registeredPlayersDisplayBackground.scrollLeft += 10;
    }, 16);
  });
  scrollRightButton.addEventListener('mouseup', () => {
    clearInterval(scrollInterval);
  });
  scrollRightButton.addEventListener('mouseleave', () => {
    clearInterval(scrollInterval);
  });

  const scrollImage = MyHtml.img({
    src: '/assets/decorative/control_panel.png',
    alt: 'Scroll Image',
    class: `scroll-image
    w-full h-full
    absolute
    z-0`
  });
  buttonRow.appendChild(scrollImage);

  return scrollContainer;
}
