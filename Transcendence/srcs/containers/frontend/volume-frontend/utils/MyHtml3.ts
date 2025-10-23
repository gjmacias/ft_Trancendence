import Logger from './Logger';

type Attributes = Record<string, string>;

export default class MyHtml {

  public static normalizeClassNames(classNames: string): string[] {
    return classNames
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(name => name.length > 0);
  }

  public static createElement<K extends keyof HTMLElementTagNameMap>(tag: K, attributes: Attributes): HTMLElementTagNameMap[K];
  public static createElement<K extends keyof SVGElementTagNameMap>(tag: K, attributes: Attributes): SVGElementTagNameMap[K];
  public static createElement(tag: string, attributes: Attributes): Element {
    let element: Element;
    if (tag === 'svg' || tag === 'use') {
      element = document.createElementNS('http://www.w3.org/2000/svg', tag) as Element;
    } else {
      element = document.createElement(tag) as Element;
    }
    if (!attributes || Object.keys(attributes).length === 0) return element;
    this.setAttributes(element as HTMLElement, attributes);
    return element;
  }

  public static div(attributes: Attributes = {}): HTMLDivElement {
    return this.createElement('div', attributes) as HTMLDivElement;
  }

  public static main(attributes: Attributes = {}): HTMLDivElement {
    return this.createElement('main', attributes) as HTMLDivElement;
  }

  public static section(attributes: Attributes = {}): HTMLDivElement {
    return this.createElement('section', attributes) as HTMLDivElement;
  }

  public static svg(attributes: Attributes = {}): SVGElement {
    return this.createElement('svg', attributes) as SVGElement;
  }

  public static svgIcon(attributes: Attributes): SVGElement {
    const iconFilePath = '/assets/icons/icons.svg';
    const svg = this.createElement('svg', attributes);
    const iconXref = attributes['href'];
    delete attributes['href']; // Remove to avoid duplication
    const use = this.createElement('use', { href: `${iconFilePath}#${iconXref}` });
    svg.appendChild(use);
    return svg;
  }

  public static textElement(tag: string, text: string, attributes: Attributes = {}): HTMLElement {
    const element = this.createElement(tag as keyof HTMLElementTagNameMap, attributes) as HTMLElement;
    element.textContent = text;
    return element;
  }

  public static h1(text: string, attributes: Attributes = {}): HTMLHeadingElement {
    return this.textElement('h1', text, attributes) as HTMLHeadingElement;
  }

  public static h2(text: string, attributes: Attributes = {}): HTMLHeadingElement {
    return this.textElement('h2', text, attributes) as HTMLHeadingElement;
  }

  public static h3(text: string, attributes: Attributes = {}): HTMLHeadingElement {
    return this.textElement('h3', text, attributes) as HTMLHeadingElement;
  }

  public static h4(text: string, attributes: Attributes = {}): HTMLHeadingElement {
    return this.textElement('h4', text, attributes) as HTMLHeadingElement;
  }

  public static span(text: string, attributes: Attributes = {}): HTMLSpanElement {
    return this.textElement('span', text, attributes) as HTMLSpanElement;
  }

  public static p(text: string, attributes: Attributes = {}): HTMLParagraphElement {
    return this.textElement('p', text, attributes) as HTMLParagraphElement;
  }

  public static header(attributes: Attributes = {}): HTMLHeadingElement {
    return this.createElement('header', attributes) as HTMLHeadingElement;
  }

  public static form(attributes: Attributes = {}): HTMLFormElement {
    return this.createElement('form', attributes) as HTMLFormElement;
  }

  public static input(attributes: Attributes = {}): HTMLInputElement {
    return this.createElement('input', attributes) as HTMLInputElement;
  }

  public static label(attributes: Attributes = {}): HTMLLabelElement {
    return this.createElement('label', attributes) as HTMLLabelElement;
  }

  public static img(attributes: Attributes = {}): HTMLImageElement {
    return this.createElement('img', attributes) as HTMLImageElement;
  }

  public static canvas(attributes: Attributes = {}): HTMLCanvasElement {
    return this.createElement('canvas', attributes) as HTMLCanvasElement;
  }

  public static footer(attributes: Attributes = {}): HTMLElement {
    return this.createElement('footer', attributes) as HTMLElement;
  }

  public static a(attributes: Attributes = {}): HTMLAnchorElement {
   return this.createElement('a', attributes) as HTMLAnchorElement;
  }
  public static anchor(attributes: Attributes = {}): HTMLAnchorElement {
    return this.createElement('a', attributes) as HTMLAnchorElement;
  }

  public static button(attributes: Attributes = {}): HTMLButtonElement {
    return this.createElement('button', attributes) as HTMLButtonElement;
  }

  public static aside(attributes: Attributes = {}): HTMLElement {
    return this.createElement('aside', attributes) as HTMLElement;
  }

  public static hr(attributes: Attributes = {}): HTMLHRElement {
    return this.createElement('hr', attributes) as HTMLHRElement;
  }

  public static ul(attributes: Attributes = {}): HTMLUListElement {
    return this.createElement('ul', attributes) as HTMLUListElement;
  }

  public static li(attributes: Attributes = {}): HTMLLIElement {
    return this.createElement('li', attributes) as HTMLLIElement;
  }

  public static select(attributes: Attributes = {}): HTMLSelectElement {
    return this.createElement('select', attributes) as HTMLSelectElement;
  }

  public static option(attributes: Attributes = {}): HTMLOptionElement {
    return this.createElement('option', attributes) as HTMLOptionElement;
  }

  public static setAttributes(element: HTMLElement, attrs: Record<string, string>): void {
    for (const [key, value] of Object.entries(attrs)) {
      try {
        switch (key) {
          case 'class':
            this.setClasses(element, value);
            break;
          case 'text':
            element.textContent = value === '<rm>' ? '' : value;
            break;
          case 'innerHTML':
            element.innerHTML = value === '<rm>' ? '' : value;
            break;
          case 'ariaLabel':
            element.setAttribute('aria-label', value);
            break;
          default:
            if (value === '<rm>') element.removeAttribute(key);
            else element.setAttribute(key, value);
            break;
        }
      } catch (error) {
        Logger.warn(`Failed to set attribute ${key}: "${value}" on element:`, element, error);
      }
    }
  }

  public static setClasses(element: Element, classes: string): void {
    if (!classes) return;
    if (!('classList' in element)) {
      Logger.warn('Element does not support classList:', element);
      return;
    }

    const tokens = this.normalizeClassNames(classes);
    let i = 0;
    if (tokens.length === 0) return;
    if (tokens[0] === '<rm>') {
      element.removeAttribute('class');
      i++;
    }

    let mode: '<+>' | '<->' = '<+>';
    for (; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === '<+>' || token === '<->') {
        mode = token as '<+>' | '<->';
        continue;
      }
      if (mode === '<+>') {
        if (!element.classList.contains(token)) element.classList.add(token);
      } else {
        if (element.classList.contains(token)) element.classList.remove(token);
      }
    }
    if (element.classList.length === 0) {
      element.removeAttribute('class');
    }
  }

  public static resetAttributes(element: HTMLElement): void {
    Array.from(element.attributes).forEach(attr => {
      element.removeAttribute(attr.name);
    });
  }

  public static getAttributes(element: HTMLElement, ...attributes: string[]): Record<string, string> {
    const attrs: Record<string, string> = {};
    for (const attr of attributes) {
      if (element.hasAttribute(attr)) {
        attrs[attr] = element.getAttribute(attr) || '';
      }
    }
    return attrs;
  }

  public static resetElement(element: HTMLElement, attributes: Attributes = {}): void {
    element.innerHTML = '';
    Array.from(element.attributes).forEach(attr => {
      element.removeAttribute(attr.name);
    });
    if (attributes && Object.keys(attributes).length > 0) {
      this.setAttributes(element, attributes);
    }
  }

  public static clearElement(element: HTMLElement): void {
    element.innerHTML = '';
    Array.from(element.attributes).forEach(attr => {
      element.removeAttribute(attr.name);
    });
  }
};
