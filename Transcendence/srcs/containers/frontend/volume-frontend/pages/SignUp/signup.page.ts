import MyHtml from '@utils/MyHtml3';
import createForm from './signup_form';
import AuthButton from '@components/AuthButton';
import Navigator from '@/Navigator';
import { arcade } from '@components/arcade_shell';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

export default function signupRender(root: HTMLElement) {
  Logger.info('Rendering Signup Page');
  MyHtml.resetElement(root, {
    class: `flex
    justify-center
    items-center
    min-h-screen min-w-screen
    bg-[url('../../assets/backgrounds/login/login_bg.png')]
    bg-cover bg-center bg-no-repeat`
  })
  root.appendChild(createSignupPage());
}

function createSignupPage(): HTMLElement {
  const signupPage = MyHtml.div({});
  const centerWrapper = createCenterWrapper();
  signupPage.appendChild(centerWrapper);

  const languageSelector = langTools.createLanguageSelector('absolute top-4 right-4');
  signupPage.appendChild(languageSelector);

  const arcadeShell = arcade.createSignupArcade();
  centerWrapper.appendChild(arcadeShell);
  const arcadeCore = arcadeShell.querySelector('#arcade-core') as HTMLElement;

  arcadeCore.appendChild(createForm());
  arcadeCore.appendChild(createDivisor());
  arcadeCore.appendChild(createAuthButtons());
  arcadeCore.appendChild(createFooter());

  signupPage.appendChild(arcadeShell);
  return signupPage;
}

function createCenterWrapper(): HTMLElement {
  const centerWrapper = MyHtml.div({
    class: `fixed
    top-1/2
    left-1/2
    -translate-x-1/2
    -translate-y-1/2`
  });
  return centerWrapper;
}

function createDivisor(): HTMLElement {
  const divisor = MyHtml.div({ class: 'z-20 flex items-center justify-center mb-4' });
  const leftLine = MyHtml.div({ class: 'w-1/3 h-px bg-stone-800' });
  const rightLine = MyHtml.div({ class: 'w-1/3 h-px bg-stone-800' });
  divisor.appendChild(leftLine);
  divisor.appendChild(MyHtml.span('or', { class: 'mx-2 text-stone-800' }));
  divisor.appendChild(rightLine);
  return divisor;
}

function createAuthButtons(): HTMLElement {
  const authButtonsContainer = MyHtml.div({
    class: `z-20
    flex flex-col
    items-center justify-center
    gap-8
    mt-2
    mb-4`
  });
  const authButton42 = new AuthButton('42', 'signup');
  const authButtonGoogle = new AuthButton('google', 'signup');
  authButtonsContainer.appendChild(authButton42.element);
  authButtonsContainer.appendChild(authButtonGoogle.element);
  return authButtonsContainer;
}

function createFooter(): HTMLElement {
  const footer = MyHtml.footer({
    class: `flex
    z-20
    items-center justify-center
    mt-6`
  });
  const p = MyHtml.p(langTools.getText('signup.footer-text'), {
    class: `text-sm
    text-stone-800`
  });
  const loginLink = MyHtml.a({
    class: `text-blue-600
    ml-1
    hover:underline
    cursor-pointer`,
    text: langTools.getText('signup.footer-link')
  });
  p.appendChild(loginLink);
  footer.appendChild(p);

  loginLink.addEventListener('click', (event) => {
    event.preventDefault();
    Navigator.navigate('/login');
  });
  return footer;
}
