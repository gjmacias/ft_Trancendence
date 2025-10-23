import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

const registeredPlayersDisplayBackground = MyHtml.div({
  class: `registered-players-background
  bg-[#303030]
  h-[140px]
  w-[800px]
  absolute
  mt-[30px]
  left-[10%]
  overflow-x-auto
  whitespace-nowrap
  overflow-y-hidden
  flex
  flex-row
  scrollbar-hide`,
  id: 'registered-players-background',
  style: 'scrollbar-width: none;'
});
export function getRegisteredPlayersDisplayBackground(): HTMLDivElement {
  return registeredPlayersDisplayBackground;
}

export default function createRegisteredPlayersDisplay(): HTMLDivElement {
  const registeredPlayersDisplay = MyHtml.div({
    class: `registered-players-display
    h-[200px]
    w-[1000px]
    overflow-y-auto
    relative`,
    id: 'registered-players-display'
  });
  registeredPlayersDisplay.appendChild(registeredPlayersDisplayBackground);
  const metalTubeImage = MyHtml.img({
    src: '/assets/decorative/metal_tube.png',
    alt: 'Metal Tube',
    class: `metal-tube-image
    w-full h-full
    absolute
    bottom-0
    left-0
    top-0
    pointer-events-none
    z-30`
  });
  registeredPlayersDisplay.appendChild(metalTubeImage);
  return registeredPlayersDisplay;
}
