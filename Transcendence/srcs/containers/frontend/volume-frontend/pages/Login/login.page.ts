import AuthButton from '@components/AuthButton';
import createLoginForm from './login_form';
import createSubmitPanel from './login_submit';
import langTools from '@utils/LanguageTools';
import MyHtml from '@utils/MyHtml3';
import Logger from '@utils/Logger';
import { arcade } from '@components/arcade_shell';

export default function loginRender(root: HTMLElement) {
  Logger.info('Rendering login page');
  MyHtml.resetElement(root, {
    class: `flex
    min-h-screen min-w-screen
    bg-[url('../../assets/backgrounds/login/login_bg.png')]
    bg-cover bg-center bg-no-repeat
    justify-center
    items-center`
  });
  root.appendChild(createLoginPage());
}

function createLoginPage(): HTMLElement {
  const loginPage = MyHtml.div();
  const centerWrapper = createCenterWrapper();

  const languageSelector = langTools.createLanguageSelector('absolute top-4 right-4');
  loginPage.appendChild(languageSelector);

  loginPage.appendChild(centerWrapper);
  const arcadeShell = arcade.createLoginArcade();
  centerWrapper.appendChild(arcadeShell);

  setupForm(arcadeShell);
  setupSubmitPanel(arcadeShell);
  setupAuthButtons(arcadeShell);

  return loginPage;
}

function setupForm(arcadeShell: HTMLElement) {
  const screen = arcadeShell.querySelector('#arcade-screen') as HTMLElement;
  if (!screen) {
    Logger.error('Screen element not found');
    return;
  }
  const loginForm = createLoginForm();
  screen.appendChild(loginForm);
}

function setupSubmitPanel(arcadeShell: HTMLElement) {
  const controlArea = arcadeShell.querySelector('#arcade-control-panel') as HTMLElement;
  if (!controlArea) {
    Logger.error('Control area element not found');
    return;
  }
  const submitPanel = createSubmitPanel(controlArea);
}

function setupAuthButtons(arcadeShell: HTMLElement) {
  const middlePanelContent = arcadeShell.querySelector('#arcade-middle-panel-content') as HTMLElement;
  if (!middlePanelContent) {
    Logger.error('Middle panel content element not found');
    return;
  }
  const authButtonsContainer = MyHtml.div({
    class: `absolute
    top-0 left-0
    size-full
    flex flex-col
    translate-x-[10px]
    gap-6
    items-center
    justify-center`
  });
  const authButton42 = new AuthButton('42', 'login');
  const authButtonGoogle = new AuthButton('google', 'login');
  authButtonsContainer.appendChild(authButton42.element);
  authButtonsContainer.appendChild(authButtonGoogle.element);
  middlePanelContent.appendChild(authButtonsContainer);
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
