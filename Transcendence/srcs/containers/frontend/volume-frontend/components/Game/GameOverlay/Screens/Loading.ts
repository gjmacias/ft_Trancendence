import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Screen from './Screen';

export default class Loading extends Screen {
  textElement: HTMLElement;

  constructor() {
    super();
    this.createLoadingScreen();
    this.hide();
  }

  public show(type: 'loading' | 'matchmaking' = 'loading') {
    this.element.style.display = 'flex';
    this.textElement.textContent = langTools.getText(`overlay.${type}-text`);
  }

  private createLoadingScreen() {
    const loadingScreen = MyHtml.div({
      class: `loading-screen
      overlay
      absolute
      left-0 top-0
      w-full h-full
      flex
      items-center
      justify-center
      bg-black
      text-white
      z-100`,
      id: 'loading-screen'
    });
    const loadingText = MyHtml.p('', {
      class: `loading-text
      mb-4
      text-5xl
      font-semibold
      mr-1`,
      id: 'loading-text'
    });
    this.textElement = loadingText;
    loadingScreen.appendChild(loadingText);
    const animatedDots = this.createAnimatedDots();
    loadingScreen.appendChild(animatedDots);
    this.element = loadingScreen;
  }

  private createAnimatedDots(): HTMLElement {
    const dotsContainer = MyHtml.div({
      class: `flex flex-row
      gap-2
      translate translate-y-2`,
      id: 'animated-dots-container'
    });
    for (let i = 0; i < 3; i++) {
      const dot = MyHtml.div({
        class: `animated-dot h-2 w-2 animate-bounce rounded-full bg-white`,
        style: `animation-delay: ${i * 0.2}s;`
      });
      dotsContainer.appendChild(dot);
    }
    return dotsContainer;
  }
}
