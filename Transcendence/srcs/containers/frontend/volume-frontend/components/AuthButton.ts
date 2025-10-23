import MyHtml from '@utils/MyHtml3';
import { authButton42ClickHandler, authButtonGoogleClickHandler } from './auth_button_handlers';
import langTools from '@utils/LanguageTools';

export default class AuthButton {
  private _element: HTMLElement;

  public get element(): HTMLElement {
    return this._element;
  }

  private static _index: number = 0;

  public static readonly validPages: string[] = ['login', 'signup'];
  public static readonly validServices: string[] = ['42', 'google'];

  private eventHandlers: { [key: string]: (e: Event) => void } = {
    '42': authButton42ClickHandler,
    'google': authButtonGoogleClickHandler,
  };

  constructor(service: string, page: string) {
    if (!AuthButton.validServices.includes(service)) {
      throw new Error(`AuthButton constructor: Invalid service '${service}'. Expected '42' or 'google'.`);
    }
    this._element = this.create(service, page, AuthButton.getIndex(), this.eventHandlers[service]);
  }

  public static setIndex(index: number): void {
    this._index = index;
  }

  private static getIndex(): number {
    const index = this._index % 2;
    this.updateIndex();
    return index;
  }

  private static updateIndex(): void {
    this._index++;
  }

  private create(service: string, page: string, index: number, eventHandler: (e: Event) => void): HTMLElement {
    let iconXref: string;
    let labelText: string;
    if (service === '42') {
      iconXref = '42-white';
      labelText = langTools.getText('signup.auth-42-button');
    } else if (service === 'google') {
      iconXref = 'google';
      labelText = langTools.getText('signup.auth-google-button');
    }

    let buttonWidthClass: string;
    let frontContainerPaddingClass: string;
    let labelClass: string;
    if (page === 'login') {
      buttonWidthClass = 'w-60';
      frontContainerPaddingClass = 'px-4';
      labelClass = 'text-[1rem] font-semibold';
    } else if (page === 'signup') {
      buttonWidthClass = 'w-72';
      frontContainerPaddingClass = 'px-6';
      labelClass = 'font-medium';
    }

    let shineOffsetFront: string;
    let shineOffsetEdge: string;
    if (index === 0) {
      shineOffsetEdge = 'left-[3%]';
      shineOffsetFront = 'left-[5%]';
    } else if (index === 1) {
      shineOffsetEdge = 'left-[-4%]';
      shineOffsetFront = 'left-[-2%]';
    }

    const buttonId = `auth-button-${service}`;
    const button = this.button(buttonWidthClass, buttonId);
    button.appendChild(this.shadow());
    button.appendChild(this.edge(shineOffsetEdge));
    button.appendChild(this.front(
      frontContainerPaddingClass,
      shineOffsetFront,
      iconXref,
      labelText,
      labelClass
    ));
    button.addEventListener('click', eventHandler);
    return button;
  }

  /* Button functions */

  private button(widthClass: string, id: string): HTMLButtonElement {
    const button = MyHtml.button({
      class: `auth-button
      relative
      ${widthClass}
      cursor-pointer
      transition-[filter]
      duration-250
      hover:brightness-110
      group`,
      id: id
    })
    return button;
  }

  /* Shadow functions */

  private shadow(): HTMLSpanElement {
    const shadow = MyHtml.span('', {
      class: `button-shadow
      absolute
      top-0 left-0
      z-10
      size-full
      rounded-md
      bg-black/25
      pointer-events-none
      translate-y-[6px]
      transition-transform
      ease
      duration-[150ms]
      will-change-transform
      group-hover:translate-y-[4px]
      group-hover:ease
      group-hover:duration-[250ms]
      group-active:translate-y-[1px]
      group-active:ease
      group-active:duration-[34ms]`
    });
    return shadow;
  }

  /* Edge functions */

  private edge(shineOffsetClass: string): HTMLSpanElement {
    const edge = this.edgeContainer();
    edge.appendChild(this.edgeBackground());
    edge.appendChild(this.edgeGradient());
    edge.appendChild(this.edgeShine(shineOffsetClass));
    edge.appendChild(this.edgeBlur());
    return edge;
  }

  private edgeContainer(): HTMLSpanElement {
    const edge = MyHtml.span('', {
      class: `edge-container
      absolute
      top-0 left-0
      z-20
      size-full
      rounded-md
      overflow-hidden`
    });
    return edge;
  }

  private edgeBackground(): HTMLSpanElement {
    const edgeBackground = MyHtml.span('', {
      class: `edge-background
      absolute
      top-0 left-0
      size-full
      rounded-md
      bg-[url("../../assets/decorative/wood_A_mid.png")]
      bg-cover
      bg-center`
    });
    return edgeBackground;
  }

  private edgeGradient(): HTMLSpanElement {
    const edgeGradient = MyHtml.span('', {
      class: `edge-gradient
      absolute
      top-0 left-0
      size-full
      rounded-md
      bg-[linear-gradient(90deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.02)_5%,rgba(255,255,255,0.02)_95%,rgba(255,255,255,0.22)_100%)]`
    });
    return edgeGradient;
  }

  private edgeShine(offsetClass: string): HTMLSpanElement {
    const edgeShine = MyHtml.span('', {
      class: `edge-shine
      absolute
      top-0 ${offsetClass}
      z-10
      size-full
      rounded-md
      bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(0,0,0,0)_25%,rgba(255,255,255,0.3)_27%,rgba(255,255,255,0.3)_35%,rgba(0,0,0,0)_37%,rgba(0,0,0,0)_55%,rgba(255,255,255,0.3)_57%,rgba(255,255,255,0.3)_65%,rgba(0,0,0,0)_67%,rgba(255,255,255,0)_100%)]
      opacity-[0.5]
      -skew-x-[2deg]
      transition-transform
      ease
      duration-[150ms]
      will-change-transform
      group-hover:translate-x-[-4%]
      group-hover:ease-out
      group-hover:duration-[400ms]
      group-active:translate-x-[-12%]
      group-active:ease
      group-active:duration-[34ms]`
    });
    return edgeShine;
  }

  private edgeBlur(): HTMLDivElement {
    const edgeBlur = MyHtml.div({
      class: `edge-blur
      absolute
      top-0 left-0
      z-10
      size-full
      rounded-md
      backdrop-blur-[0.3px]
      pointer-events-none`
    });
    return edgeBlur;
  }

  /* Front functions */

  private front(
    paddingClass: string,
    shineOffsetFront: string,
    iconXref: string,
    labelText: string,
    labelClass: string
  ): HTMLSpanElement {
    const front = this.frontContainer(paddingClass);
    front.appendChild(this.frontBlur());
    front.appendChild(this.frontShine(shineOffsetFront));
    front.appendChild(this.frontIcon(iconXref));
    front.appendChild(this.frontLabel(labelText, labelClass));
    return front;
  }

  private frontContainer(paddingClass: string): HTMLSpanElement {
    const frontContainer = MyHtml.span('', {
      class: `front-container
      flex
      items-center
      justify-start
      block
      relative
      py-2 ${paddingClass}
      z-30
      rounded-md
      bg-[url("../../assets/decorative/wood_A_mid.png")]
      overflow-hidden
      bg-cover
      bg-center
      border-white/10
      border-[0.5px]
      text-[1.15rem]
      text-white
      transition-transform
      translate-y-[-8px]
      ease
      duration-[150ms]
      will-change-transform
      group-hover:translate-y-[-5px]
      group-hover:ease
      group-hover:duration-[250ms]
      group-active:translate-y-[-2px]
      group-active:ease
      group-active:duration-[34ms]`
    });
    return frontContainer;
  }

  private frontBlur(): HTMLDivElement {
    const frontBlur = MyHtml.div({
      class: `front-blur
      absolute
      top-0 left-0
      z-10
      size-full
      rounded-md
      backdrop-blur-[0.5px]
      shadow-[_inset_0_2px_4px_rgba(255,255,255,0.2)]
      pointer-events-none`
    });
    return frontBlur;
  }

  private frontShine(offsetClass: string): HTMLDivElement {
    const frontShine = MyHtml.div({
      class: `front-shine
      absolute
      top-0 ${offsetClass}
      z-10
      size-full
      pointer-events-none
      bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(0,0,0,0)_25%,rgba(255,255,255,0.3)_27%,rgba(255,255,255,0.3)_35%,rgba(0,0,0,0)_37%,rgba(0,0,0,0)_55%,rgba(255,255,255,0.3)_57%,rgba(255,255,255,0.3)_65%,rgba(0,0,0,0)_67%,rgba(255,255,255,0)_100%)]
      -skew-x-[13deg]
      transition-transform
      ease
      duration-[150ms]
      will-change-transform
      group-hover:duration-[400ms]
      group-hover:ease-out
      group-hover:translate-x-[-4%]
      group-active:duration-[34ms]
      group-active:ease
      group-active:translate-x-[-12%]`
    });
    return frontShine;
  }

  private frontIcon(iconXref: string): SVGElement {
    const frontIcon = MyHtml.svgIcon({
      href: iconXref,
      class: `z-20
      w-6 h-6
      mr-2`,
      ariaHidden: 'true'
    });
    return frontIcon;
  }

  private frontLabel(label: string, labelClass: string): HTMLSpanElement {
    const frontLabel = MyHtml.span(label, {
      class: `label
      z-20
      ${labelClass}
      text-left`
    });
    return frontLabel;
  }
}
