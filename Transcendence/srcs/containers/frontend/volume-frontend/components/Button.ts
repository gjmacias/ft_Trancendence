import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

type Attributes = Record<string, string>;
type ButtonState = 'active' | 'inactive';

export default class Button {
  private activeElement: HTMLButtonElement;
  private inactiveElement: HTMLButtonElement;

  private active: boolean;

  private activeAttributes: Attributes;
  private inactiveAttributes: Attributes;

  constructor(
    attributes: {
      'active': Attributes,
      'inactive': Attributes | null
    },
    state: ButtonState = 'active',
  ) {
    this.activeAttributes = attributes.active;
    this.inactiveAttributes = attributes.inactive || attributes.active;
    this.active = state === 'active' ? true : false;
    this.activeElement = MyHtml.button(this.activeAttributes);
    this.inactiveElement = MyHtml.button(this.inactiveAttributes);
    this.setActive(this.active);
  }

  public getElement(state?: ButtonState): HTMLButtonElement {
    if (state) {
      return state === 'active' ? this.activeElement : this.inactiveElement;
    }
    return this.active ? this.activeElement : this.inactiveElement;
  }

  public activate() {
    this.setActive(true);
  }
  public deactivate() {
    this.setActive(false);
  }
  public toggle() {
    this.setActive(!this.active);
  }
  public setActive(active: boolean) {
    this.active = active;
    if (this.active) {
      this.inactiveElement.replaceWith(this.activeElement);
    } else {
      this.activeElement.replaceWith(this.inactiveElement);
    }
  }

  public getCurrentAttributes(): Attributes {
    return this.active ? this.activeAttributes : this.inactiveAttributes;
  }

  public addEventListener(state: 'active' | 'inactive' | 'all', type: string, listener: EventListenerOrEventListenerObject) {
    if (state === 'active') {
      this.activeElement.addEventListener(type, listener);
    } else if (state === 'inactive') {
      this.inactiveElement.addEventListener(type, listener);
    } else {
      this.activeElement.addEventListener(type, listener);
      this.inactiveElement.addEventListener(type, listener);
    }
  }
  public removeEventListener(state: 'active' | 'inactive' | 'all', type: string, listener: EventListenerOrEventListenerObject) {
    if (state === 'active') {
      this.activeElement.removeEventListener(type, listener);
    } else if (state === 'inactive') {
      this.inactiveElement.removeEventListener(type, listener);
    } else {
      this.activeElement.removeEventListener(type, listener);
      this.inactiveElement.removeEventListener(type, listener);
    }
  }
}
