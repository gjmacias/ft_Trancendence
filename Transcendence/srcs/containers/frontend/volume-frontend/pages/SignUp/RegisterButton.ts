import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';

const registerButtonClass = {
  active: {
    button: 'pushable relative mx-3 my-4 border-none bg-transparent p-0 cursor-pointer outline-offset-4 transition-[filter] duration-250 focus:not-focus-visible:outline-none hover:brightness-125 group',
    shadow: 'shadow absolute top-0 left-0 w-full h-full rounded-md bg-black/25 will-change-transform translate-y-[6px] transition-transform duration-[150ms] ease group-hover:translate-y-[4px] group-hover:transition-transform group-hover:duration-[250ms] group-hover:ease group-active:translate-y-[1px] group-active:transition-transform group-active:duration-[34ms] z-10',
    edge: 'edge absolute top-0 left-0 w-full h-full rounded-md bg-[linear-gradient(to_left,_rgba(89,13,13,1)_0%,_rgba(133,20,20,1)_8%,_rgba(133,20,20,1)_92%,_rgba(89,13,13,1)_100%)] border-white/10 border-[0.5px] z-20',
    front: 'front block relative px-8 py-2 rounded-md bg-red-700 border-white/10 border-[0.5px] text-[1.25rem] text-white will-change-transform translate-y-[-8px] transition-transform duration-[150ms] ease group-hover:translate-y-[-5px] group-hover:transition-transform group-hover:duration-[250ms] group-hover:ease group-active:translate-y-[-1px] group-active:transition-transform group-active:duration-[34ms] z-30'
  },
  disabled: {
    button: 'pushable relative mx-3 my-4 border-none bg-transparent p-0 cursor-default outline-offset-4 transition-[filter] duration-250 focus:not-focus-visible:outline-none group',
    shadow: 'shadow absolute top-0 left-0 w-full h-full rounded-md bg-black/25 translate-y-[2px] z-10',
    edge: 'edge absolute top-0 left-0 w-full h-full rounded-md bg-[linear-gradient(to_left,_rgba(164,14,14,1)_0%,_rgba(225,20,20,1)_8%,_rgba(225,20,20,1)_92%,_rgba(164,14,14,1)_100%)] border-white/40 border-[0.5px] z-20',
    front: 'front block relative px-8 py-2 rounded-md bg-red-500 border-white/40 border-[0.5px] text-[1.25rem] text-white/80 translate-y-[-4px] z-30'
  }
};

export default class RegisterButton {
  public static create(): HTMLButtonElement {
    const button = MyHtml.button({
      class: registerButtonClass.disabled.button,
      type: 'submit',
      disabled: 'true'
    });
    const shadow = MyHtml.span('', { class: registerButtonClass.disabled.shadow });
    const edge = MyHtml.span('', { class: registerButtonClass.disabled.edge });
    const front = MyHtml.span(langTools.getText('signup.form-register-button'), { class: registerButtonClass.disabled.front });
    button.appendChild(shadow);
    button.appendChild(edge);
    button.appendChild(front);
    return button;
  }

  public static setState(button: HTMLButtonElement, active: boolean): void {
    if (active) {
      RegisterButton.setActive(button);
    } else {
      RegisterButton.setDisabled(button);
    }
  }

  public static setActive(button: HTMLButtonElement): void {
    const shadow = button.querySelector('.shadow') as HTMLSpanElement;
    const edge = button.querySelector('.edge') as HTMLSpanElement;
    const front = button.querySelector('.front') as HTMLSpanElement;
    button.className = registerButtonClass.active.button;
    shadow.className = registerButtonClass.active.shadow;
    edge.className = registerButtonClass.active.edge
    front.className = registerButtonClass.active.front;
    button.removeAttribute('disabled');
    button.disabled = false;
  }

  public static setDisabled(button: HTMLButtonElement): void {
    const shadow = button.querySelector('.shadow') as HTMLSpanElement;
    const edge = button.querySelector('.edge') as HTMLSpanElement;
    const front = button.querySelector('.front') as HTMLSpanElement;
    button.className = registerButtonClass.disabled.button;
    shadow.className = registerButtonClass.disabled.shadow;
    edge.className = registerButtonClass.disabled.edge;
    front.className = registerButtonClass.disabled.front;
    button.setAttribute('disabled', 'true');
    button.disabled = true;
  }

  public static getState(button: HTMLButtonElement): boolean {
    return !button.disabled;
  }
}
