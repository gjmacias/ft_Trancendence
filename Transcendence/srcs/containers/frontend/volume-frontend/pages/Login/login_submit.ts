import MyHtml from '@utils/MyHtml3'
import { handleLoginInputEvent, handleSignUpInputEvent } from './login_events';
import langTools from '@utils/LanguageTools';

export default function createSubmitPanel(submitPanel: HTMLElement): HTMLElement {
  const loginButton = createLoginButton(handleLoginInputEvent);
  const signupButton = createSignUpButton(handleSignUpInputEvent);
  submitPanel.appendChild(loginButton);
  submitPanel.appendChild(signupButton);
  return submitPanel;
}

function createLoginButton(clickHandler: (e: Event) => void): HTMLElement {
  const loginButtonSpecificClasses = [
    'hover:shadow-[0_0_10px_4px_rgba(34,197,94,0.7)]',
    'hover:inset-shadow-[0_0_6px_2px_rgba(255,255,255,0.1)]',
    'active:shadow-[0_0_8px_6px_rgba(34,197,94,0.4)]',
    'active:inset-shadow-[0_0_8px_4px_rgba(0,0,0,0.6)]'
  ];
  const button = createSubmitButton('login', clickHandler);
  button.classList.add(...loginButtonSpecificClasses);
  return button;
}

function createSignUpButton(clickHandler: (e: Event) => void): HTMLElement {
  const signUpButtonSpecificClasses = [
    'hover:shadow-[0_0_10px_4px_rgba(230,44,34,0.6)]',
    'hover:inset-shadow-[0_0_6px_2px_rgba(255,255,255,0.1)]',
    'active:shadow-[0_0_8px_6px_rgba(230,44,34,0.3)]',
    'active:inset-shadow-[0_0_8px_4px_rgba(0,0,0,0.6)]'
  ];
  const button = createSubmitButton('signup', clickHandler);
  button.classList.add(...signUpButtonSpecificClasses);
  return button;
}

function createSubmitButton(type: string, clickHandler: (e: Event) => void): HTMLElement {
  const button = MyHtml.button({
    class: `bg-stone-800
    h-8 w-24
    border
    border-stone-800
    rounded-sm
    cursor-pointer
    duration-150
    transition-shadow
    transition-colors
    disabled:bg-stone-700
    disabled:border-none
    disabled:cursor-not-allowed
    disabled:shadow-none
    disabled:inset-shadow-none
    disabled:brightness-100
    group`
  });
  const buttonLabel = MyHtml.span(langTools.getText(`login.form-${type}-button`), {
    class: `text-stone-200
    w-full
    text-md
    font-semibold
    inline-block
    duration-100
    will-change-auto
    transition-transform
    ease
    group-hover:text-white
    group-active:text-stone-100
    group-active:translate-y-[0.5px]
    group-active:text-[0.92rem]
    group-active:transition-transform
    group-active:duration-50
    group-disabled:opacity-90
    group-disabled:translate-y-0
    group-disabled:text-[1rem]
    group-disabled:text-stone-200`,
    type: 'button',
    id: `${type}-btn`
  });
  button.appendChild(buttonLabel);
  button.addEventListener('click', clickHandler);
  return button;
}
