import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';

class ArcadeComponent {

  private _page: 'login' | 'signup' | 'register' = 'login';

  private _labels = {
    login: "Welcome!",
    signup: "Sign Up",
    register: "Register",
  }

  public createLoginArcade(): HTMLElement {
    this._page = 'login';
    const loginArcade = this.createArcade();
    const arcadeCore = loginArcade.querySelector('#arcade-core-container') as HTMLElement;

    const arcadeContent = this.createArcadeLoginCore();
    arcadeCore.appendChild(arcadeContent);

    return loginArcade
  }

  public createSignupArcade(): HTMLElement {
    this._page = 'signup';
    const signupArcade = this.createArcade();
    const arcadeCore = signupArcade.querySelector('#arcade-core-container') as HTMLElement;

    const arcadeContent = this.createArcadeSignUpCore();
    arcadeCore.appendChild(arcadeContent);

    return signupArcade;
  }

  public createRegisterArcade(): HTMLElement {
    this._page = 'register';
    const registerArcade = this.createArcade();
    return registerArcade;
  }

  private createArcadeSignUpCore(): HTMLElement {
    const arcadeCore = MyHtml.div({
      class: `flex flex-col
      w-full h-full`,
      id: 'arcade-core'
    });
    arcadeCore.appendChild(this.createHeader());
    return arcadeCore;
  }

  private createArcadeLoginCore(): HTMLElement {
    const arcadeCore = MyHtml.div({
      class: `flex flex-col
      z-20
      w-full h-full`
    });
    arcadeCore.appendChild(this.createUpperSection());
    arcadeCore.appendChild(this.createLowerSection());

    return arcadeCore;
  }

  private createUpperSection(): HTMLElement {
    const upperSection = MyHtml.section({
      class: `flex flex-col
      h-[50.5%] w-full`,
      id: 'arcade-upper-section'
    });
  
    upperSection.appendChild(this.createScreenArea());
    upperSection.appendChild(this.createControlArea());
  
    return upperSection;
  }

  private createScreenArea(): HTMLElement {
    const screenArea = MyHtml.div({
      class: `relative
      flex
      h-3/4 w-full
      justify-start`
    });
    const screenUNKNOWN = MyHtml.div({
      class: `absolute
      top-0 left-0
      size-full`
    });
    screenArea.appendChild(screenUNKNOWN);
  
    const screenContainer = MyHtml.div({
      class: `absolute
      top-0 left-0
      size-full
      flex flex-col
      items-center
      justify-center`
    });
    const header = this.createHeader();
    screenContainer.appendChild(header);
    const screen = this.createScreen();
    screenContainer.appendChild(screen);
    screenArea.appendChild(screenContainer);
    return screenArea;
  }

  private createHeader(): HTMLElement {
    const titleText = langTools.getText(`${this._page}.page-title`) ;
    const signupClasses = this._page === 'signup' ? 'mt-4' : '';
    const header = MyHtml.header({
      class: `flex
      items-center
      justify-center
      space-x-4
      px-6 py-2
      mb-2 ${signupClasses}
      z-20`,
      id: 'arcade-header'
    });
    const logo = MyHtml.svgIcon({
      href: 'logo-outline',
      class: 'size-16',
      alt: 'Arcade Logo',
    });
    header.appendChild(logo);
    const title = MyHtml.h2(titleText, {
      class: `text-3xl
      font-semibold`,
      id: 'arcade-title'
    });
    header.appendChild(title);
    return header;
  }
  
  private createScreen(): HTMLElement {
    const screen = MyHtml.div({
      class: `flex flex-col
      w-[80%] h-[60%]
      bg-[url(/assets/decorative/screen.svg)]
      bg-cover bg-center`,
      id: 'arcade-screen'
    });
    return screen;
  }

  private createControlArea(): HTMLElement {
    const controlArea = MyHtml.div({
      class: `flex flex-col
      h-1/4 w-full
      inset-shadow-sm
      inset-shadow-black/10`
    });
    const controlPanel = MyHtml.div({
      class: `flex
      w-[80%] h-[60%]
      my-5
      gap-5
      justify-evenly
      items-center
      self-center
      bg-[url(/assets/decorative/control_panel.png)]
      bg-cover bg-center`,
      id: 'arcade-control-panel'
    });
    controlArea.appendChild(controlPanel);
    return controlArea;
  }

  private createLowerSection(): HTMLElement {
    const lowerSection = MyHtml.section({
      class: `flex flex-col
      h-[49.5%] w-full`
    });
    const middlePanel = this.createMiddlePanel();
    lowerSection.appendChild(middlePanel);
    const bottomPanel = this.createBottomPanel();
    lowerSection.appendChild(bottomPanel);
    return lowerSection;
  }

  private createMiddlePanel(): HTMLElement {
    const middlePanel = MyHtml.div({
      class: `relative
      flex
      h-1/2 w-full
      bg-[url(/assets/decorative/wood_A_mid.png)]
      bg-cover bg-center
      border-t border-neutral-950`
    });
    const middlePanelOverlay = MyHtml.div({
      class: `absolute
      top-0 left-0
      w-full h-8
      z-10
      bg-gradient-to-b
      from-black/40
      to-transparent
      pointer-events-none`
    });
    middlePanel.appendChild(middlePanelOverlay);

    const middlePanelContent = MyHtml.div({
      class: `relative
      flex flex-col
      h-full w-2/3
      items-center`,
      id: 'arcade-middle-panel-content'
    });
    middlePanel.appendChild(middlePanelContent);

    const coinDoor = this.createCoinDoor();
    middlePanel.appendChild(coinDoor);

    return middlePanel;
  }

  private createCoinDoor(): HTMLElement {
    const coinDoor = MyHtml.div({
      class: `flex
      h-full w-1/3
      justify-center`
    });
    const coinDoorImg = MyHtml.img({
      src: '/assets/decorative/coin_door.png',
      alt: 'Coin Door',
      class: `h-32 self-center`
    });
    coinDoor.appendChild(coinDoorImg);
    return coinDoor;
  }

  private createBottomPanel(): HTMLElement {
    const bottomPanel = MyHtml.div({
      class: `relative
      flex
      h-1/2 w-full
      bg-[url(../../assets/decorative/wood_B_mid.png)] bg-cover bg-center
      border-t-2 border-stone-950`
    });
    const bottomPanelOverlay = MyHtml.div({
      class: `absolute
      top-0 left-0
      size-full
      z-10
      bg-gradient-to-b
      from-black/20
      to-transparent
      pointer-events-none`
    });
    const bottomPanelOverlayB = MyHtml.div({
      class: `absolute
      top-0 left-0
      size-full
      bg-[radial-gradient(circle_at_50%_60%,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.3)_100%)]`
    });
    bottomPanelOverlay.appendChild(bottomPanelOverlayB);
    bottomPanel.appendChild(bottomPanelOverlay);
    return bottomPanel;
  }

  createArcade(): HTMLElement {
    const arcadeShell = MyHtml.div({
      class: `flex
      flex-col
      w-[400px]
      h-[800px]`,
      id: 'arcade-shell'
    });
    const borderTop = this.createBorderTop();
    arcadeShell.appendChild(borderTop);
    const arcadeFrame = this.createArcadeFrame();
    arcadeShell.appendChild(arcadeFrame);
    const arcadeShadow = this.createShadow();
    arcadeShell.appendChild(arcadeShadow);
    return arcadeShell;
  }

  private createArcadeFrame(): HTMLElement {
    const arcadeFrame = MyHtml.div({
      class: `flex
      size-full`,
      id: 'arcade-frame'
    });
    const borderLeft = this.createBorderSide();
    arcadeFrame.appendChild(borderLeft);

    const arcadeCore = MyHtml.div({
      class: `relative
      flex
      flex-col
      h-[99%] w-full
      bg-mainYellow`,
      id: 'arcade-core-container'
    });
    const arcadeCoreBackground = MyHtml.div({
      class: `absolute
      top-0 left-0
      z-10
      w-full h-full
      overflow-hidden
      pointer-events-none`
    });
    const arcadeCoreUpperShadow = MyHtml.div({
      class: `absolute
      top-0 left-0
      size-full
      bg-[radial-gradient(circle_at_50%_70%,_rgba(0,0,0,0)_0%,_rgba(189,156,42,0)_85%,_rgba(189,156,42,1)_100%)]
      pointer-events-none`
    });
    const arcadeCoreMiddleShadow = MyHtml.div({
      class: `absolute
      -top-10 left-1/2
      -translate-x-1/2
      h-1/2 w-full
      bg-[radial-gradient(circle_at_50%_50%,_rgba(255,228,85,1)_0%,_rgba(255,228,85,0.6)_50%,_rgba(0,0,0,0)_70%)]
      pointer-events-none`
    });
    const arcadeCoreLowerShadow = MyHtml.div({
      class: `absolute
      top-0 left-0
      w-full h-full
      bg-linear-to-b
      from-black/0
      via-black/0 via-60%
      to-[#BE9E2B]
      pointer-events-none`
    });
    arcadeFrame.appendChild(arcadeCore);
    arcadeCoreBackground.appendChild(arcadeCoreUpperShadow);
    arcadeCoreBackground.appendChild(arcadeCoreMiddleShadow);
    arcadeCoreBackground.appendChild(arcadeCoreLowerShadow);
    arcadeCore.appendChild(arcadeCoreBackground);

    const borderRight = this.createBorderSide();
    arcadeFrame.appendChild(borderRight);
    return arcadeFrame;
  }

  private createShadow(): HTMLElement {
    const shadow = MyHtml.div({
      class: `pointer-events-none
      fixed
      left-1/2 top-[calc(50%+330px)]
      -translate-x-1/2
      w-[1200px]
      h-32
      -z-10
      bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.8)_20%,rgba(0,0,0,0.7)_40%,rgba(0,0,0,0.6)_60%,rgba(0,0,0,0.4)_80%,rgba(0,0,0,0)_100%)]
      blur-[2px]`
    });
    return shadow;
  }


  private createBorderTop(): HTMLElement {
    const borderTop = MyHtml.div({
      class: `relative
      flex
      bg-black
      h-3
      w-[102%]
      self-center
      border
      border-stone-900
      bg-[linear-gradient(_90deg,_rgba(255,255,255,0.3)_0%,_rgba(0,0,0,0)_2%,_rgba(0,0,0,0)_98%,_rgba(255,255,255,0.3)_100%)]`,
      id: 'arcade-top-border'
    });
    const borderTopOverlay = MyHtml.div({
      class: `absolute
      top-0 left-0
      size-full
      flex
      bg-[linear-gradient(_180deg,_rgba(255,255,255,0.4)_0%,_rgba(0,0,0,0)_20%,_rgba(0,0,0,0)_80%,_rgba(255,255,255,0.4)_100%)]`
    });
    borderTop.appendChild(borderTopOverlay);
    return borderTop;
  }

  private createBorderSide(): HTMLElement {
    const borderSide = MyHtml.div({
      class: `relative
      flex flex-col
      bg-black
      h-full w-3
      border border-stone-900
      bg-[linear-gradient(_180deg,_rgba(0,0,0,1)_0%,_rgba(0,0,0,1)_31%,_rgba(255,255,255,0.6)_37.4%,_rgba(0,0,0,0)_41.5%,_rgba(0,0,0,1)_49%,_rgba(255,255,255,0.4)_50%,_rgba(0,0,0,1)_50%,_rgba(0,0,0,1)_100%)]`
    });
    const gradientA = MyHtml.div({
      class: `absolute
      top-0 left-0
      size-full
      bg-[linear-gradient(_90deg,_rgba(255,255,255,0.4)_0%,_rgba(0,0,0,0)_20%,_rgba(0,0,0,0)_80%,_rgba(255,255,255,0.4)_100%)]`
    });
    const gradientB = MyHtml.div({
      class: `absolute
      top-0 left-0
      size-full
      bg-[linear-gradient(_180deg,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0)_50%,_rgba(0,0,0,0.9)_100%)]`
    });
    borderSide.appendChild(gradientA);
    borderSide.appendChild(gradientB);
    return borderSide;
  }

};

export const arcade = new ArcadeComponent();
