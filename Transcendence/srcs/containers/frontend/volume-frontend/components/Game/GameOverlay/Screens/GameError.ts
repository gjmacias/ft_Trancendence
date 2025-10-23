import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Screen from './Screen';

export default class GameError extends Screen {
  private errorMessageElement: HTMLParagraphElement;

  constructor() {
    super();
    this.createErrorScreen();
    this.hide();
  }

  public show(...args: any[]): void {
    this.element.style.display = 'flex';
    if (args[0] && args[0] === 'alreadyInGame') {
      this.errorMessageElement.textContent = langTools.getText('overlay.error-text-already-in-game');
    } else {
      this.errorMessageElement.textContent = langTools.getText('overlay.error-text');
    }
  }

  private createErrorScreen() {
    const errorScreen = MyHtml.div({
      class: `error-screen
      overlay
      absolute
      left-0 top-0
      w-full h-full
      flex
      flex-col
      items-center
      justify-center
      bg-black
      text-neutral-100
      z-100`,
      id: 'error-screen'
    });
    this.element = errorScreen;
    const errorPopup = MyHtml.div({
      class: `error-popup
      bg-gradient-to-b
      from-[#85241F]
      to-neutral-800
      to-40%
      p-8
      border-8 border-neutral-100
      rounded-sm
      shadow-lg
      text-center`,
      id: 'error-popup'
    });
    errorScreen.appendChild(errorPopup);
    const errorHeader = MyHtml.div({
      class: `error-header
      flex
      justify-center
      gap-4
      mb-4`,
      id: 'error-header'
    });
    errorPopup.appendChild(errorHeader);
    const errorIcon = MyHtml.img({
      src: '/assets/icons/error.svg',
      class: `error-icon
      w-20 h-20
      -translate-y-2
      text-red-600
      mb-4
      z-100`,
      id: 'error-icon'
    });
    errorHeader.appendChild(errorIcon);
    const errorTitle = MyHtml.h1(langTools.getText('overlay.error-title'), {
      class: `error-title
      text-6xl
      font-bold
      mb-4`,
      id: 'error-title'
    });
    errorHeader.appendChild(errorTitle);
    const errorMessage = MyHtml.p(langTools.getText('overlay.error-text'), {
      class: `error-message
      text-2xl`,
      id: 'error-message'
    });
    this.errorMessageElement = errorMessage;
    errorPopup.appendChild(errorMessage);    
    const returnButton = MyHtml.button({
      text: langTools.getText('overlay.results-return-button'),
      class: `return-button
      rounded-md
      mt-16
      py-4
      px-8
      text-white
      text-2xl
      font-bold
      bg-linear-to-b
      from-red-500
      to-red-600
      hover:from-red-400
      hover:to-red-500
      active:from-red-600
      active:to-red-700
      shadow-md
      shadow-white/10
      hover:shadow-lg
      hover:shadow-white/20
      active:shadow-lg
      active:shadow-white/5
      cursor-pointer
      transition-colors`,
      id: 'return-button'
    });
    returnButton.addEventListener('click', () => {
      window.location.reload();
    });
    errorPopup.appendChild(returnButton);
  }
}