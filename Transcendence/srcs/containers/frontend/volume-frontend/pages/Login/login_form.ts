import { handleLoginInputEvent } from './login_events';
import MyHtml from '@utils/MyHtml3'
import langTools from '@utils/LanguageTools';

export default function createLoginForm(): HTMLElement {
  const loginForm = MyHtml.form({
    class: `flex flex-col
    self-center justify-start
    h-full w-[70%]`
  });

  const errorDiv = MyHtml.div({
    class: `hidden text-red-500 text-xs font-bold text-center animate-fade-in absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-max pointer-events-none z-20`
  });
  errorDiv.setAttribute('id', 'login-error');
  loginForm.appendChild(errorDiv);

  const nicknameInput = MyHtml.input({
    class: `font-['Press_Start_2P'] py-4 m-4 text-xs bg-transparent border-none outline-none text-white placeholder:text-neutral-400`,
    type: 'text',
    name: 'nickname',
    placeholder: langTools.getText('login.form-nickname'),
    required: 'true',
    ariaLabel: 'Nickname'
  });

  const passwordInput = MyHtml.input({
    class: `font-['Press_Start_2P'] py-2 px-2 m-4 text-xs bg-transparent border-none outline-none text-white placeholder:text-neutral-400`,
    type: 'password',
    name: 'password',
    placeholder: langTools.getText('login.form-password'),
    required: 'true',
    ariaLabel: 'Password'
  });

  passwordInput.addEventListener('keydown', handleLoginInputEvent);

  loginForm.appendChild(nicknameInput);
  loginForm.appendChild(passwordInput);

  return loginForm;
}
