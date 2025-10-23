export default class MyHtml {

  public static normalizeClassNames(classNames: string): string[] {
    return classNames
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(name => name.length > 0);
  }

  public static createElement<K extends keyof HTMLElementTagNameMap>(tag: K, ...options: string[]): HTMLElementTagNameMap[K];
  public static createElement<K extends keyof SVGElementTagNameMap>(tag: K, ...options: string[]): SVGElementTagNameMap[K];
  public static createElement(tag: string, ...options: string[]): Element {
    let element: Element;
    if (tag === 'svg' || tag === 'use') {
      element = document.createElementNS('http://www.w3.org/2000/svg', tag) as Element;
    } else {
      element = document.createElement(tag) as Element;
    }
    if (options.length === 0) return element;
    this.setAttributes(element as HTMLElement, ...options);
    return element;
  }

  public static div(...options: string[]): HTMLDivElement {
    const div = this.createElement('div', ...options) as HTMLDivElement;
    return div;
  }

  public static main(...options: string[]): HTMLDivElement {
    const main = this.createElement('main', ...options) as HTMLDivElement;
    return main;
  }

  public static section(...options: string[]): HTMLDivElement {
    const div = this.createElement('section', ...options) as HTMLDivElement;
    return div;
  }

  public static svg(...options: string[]): SVGElement {
    const svg = this.createElement('svg', ...options) as SVGElement;
    return svg;
  }

  public static svgIcon(iconXref: string, ...options: string[]): SVGElement {
    const iconFilePath = '/assets/icons/icons.svg';
    const svg = this.createElement('svg', ...options);
    const use = this.createElement('use', `@href:${iconFilePath}#${iconXref}`);
    svg.appendChild(use);
    return svg;
  }

  public static textElement(tag: string, text: string, ...options: string[]): HTMLElement {
    const element = this.createElement(tag as keyof HTMLElementTagNameMap, ...options) as HTMLElement;
    element.textContent = text;
    return element;
  }

  public static header(...options: string[]): HTMLHeadingElement {
    const header = this.createElement('header', ...options) as HTMLHeadingElement;
    return header;
  }

  public static form(...options: string[]): HTMLFormElement {
    const form = this.createElement('form', ...options) as HTMLFormElement;
    return form;
  }

  public static input(...options: string[]): HTMLInputElement {
    const input = this.createElement('input', ...options) as HTMLInputElement;
    return input;
  }

  public static label(...options: string[]): HTMLLabelElement {
    const label = this.createElement('label', ...options) as HTMLLabelElement;
    return label;
  }

  public static span(...options: string[]): HTMLSpanElement {
    let text = '';
    options.forEach(option => {
      if (option.startsWith('@text:')) {
        text = option.slice(6);
      }
    });
    const span = this.textElement('span', text, ...options) as HTMLSpanElement;
    return span;
  }

  public static img(src: string, ...options: string[]): HTMLImageElement {
    const img = this.createElement('img', ...options) as HTMLImageElement;
    img.src = src;
    return img;
  }

  public static canvas(...options: string[]): HTMLCanvasElement {
    const canvas = this.createElement('canvas', ...options) as HTMLCanvasElement;
    return canvas;
  }

  public static footer(...options: string[]): HTMLElement {
    const footer = this.createElement('footer', ...options) as HTMLElement;
    return footer;
  }

  public static a(...options: string[]): HTMLAnchorElement {
    const anchor = this.createElement('a', ...options) as HTMLAnchorElement;
    return anchor;
  }
  public static anchor(...options: string[]): HTMLAnchorElement {
    const anchor = this.createElement('a', ...options) as HTMLAnchorElement;
    return anchor;
  }

  public static dialog(...options: string[]): HTMLDialogElement {
    const dialog = this.createElement('dialog', ...options) as HTMLDialogElement;
    return dialog;
  }

  public static button(...options: string[]): HTMLButtonElement {
    const button = this.createElement('button', ...options) as HTMLButtonElement;
    return button;
  }

  public static p(...options: string[]): HTMLParagraphElement {
    const p = this.createElement('p', ...options) as HTMLParagraphElement;
    return p;
  }

  public static aside(...options: string[]): HTMLElement {
    const aside = this.createElement('aside', ...options) as HTMLElement;
    return aside;
  }

  public static hr(...options: string[]): HTMLHRElement {
    const hr = this.createElement('hr', ...options) as HTMLHRElement;
    return hr;
  }

  public static ul(...options: string[]): HTMLUListElement {
    const ul = this.createElement('ul', ...options) as HTMLUListElement;
    return ul;
  }

  public static li(...options: string[]): HTMLLIElement {
    const li = this.createElement('li', ...options) as HTMLLIElement;
    return li;
  }

  public static select(...options: string[]): HTMLSelectElement {
    const select = this.createElement('select', ...options) as HTMLSelectElement;
    return select;
  }

  public static option(...options: string[]): HTMLOptionElement {
    const option = this.createElement('option', ...options) as HTMLOptionElement;
    return option;
  }

  public static setAttributes(element: HTMLElement, ...options: string[]): void {
    for (const option of options) {
      if (!option) continue;
      if (option[0] !== '@') {
        this.setClasses(element, option);
        continue;
      }
      const [attr, ...rest] = option.slice(1).split(':');
      const value = rest.join(':');
      switch (attr) {
        case 'class':
          this.setClasses(element, value);
          break;
        case 'text':
          element.textContent = value === '<rm>' ? '' : value;
          break;
        case 'innerHTML':
          element.innerHTML = value === '<rm>' ? '' : value;
          break;
        default:
          if (value === '<rm>') element.removeAttribute(attr);
          else element.setAttribute(attr, value);
          break;
      }
    }
  }

  public static setClasses(element: Element, classes: string): void {
    if (!classes) return;

    if (!('classList' in element)) {
      console.warn('Element does not support classList:', element);
      return;
    }

    const tokens = this.normalizeClassNames(classes);
    if (tokens.length === 0) return;

    let i = 0;
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

  public static resetElement(element: HTMLElement): void {
    element.innerHTML = '';
    Array.from(element.attributes).forEach(attr => {
      element.removeAttribute(attr.name);
    });
  }
};
