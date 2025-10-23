import Navigator from '@/Navigator';
import MyHtml from '@utils/MyHtml3';
import API_ROUTES from '@utils/api.routes';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';
import showAlert from '@components/showAlert';

let loginDisabled = false;

export function handleLoginInputEvent(e: Event) {
  if (e instanceof KeyboardEvent && e.key !== 'Enter') {
    return;
  }
  const loginButton = document.querySelector('#login-btn') as HTMLButtonElement;
  const form = document.querySelector('form') as HTMLFormElement;
  if (!form) {
    Logger.error('Login form not found');
    return;
  }
  if (loginDisabled) return;
  handleLogin(form, () => {
    loginDisabled = true;
    loginButton.setAttribute('disabled', 'true');
    setTimeout(() => {
      loginDisabled = false;
      loginButton.removeAttribute('disabled');
    }, 1250);
  });
}

async function handleLogin(from: HTMLFormElement, onFail?: () => void) {
  const nicknameInput = from.elements.namedItem('nickname') as HTMLInputElement;
  const passwordInput = from.elements.namedItem('password') as HTMLInputElement;
  const nickname = nicknameInput?.value;
  const password = passwordInput?.value;
  const errorDiv = from.querySelector('#login-error') as HTMLDivElement;

  errorDiv.classList.add('hidden');
  nicknameInput.classList.remove('text-red-500');
  nicknameInput.classList.add('text-white');
  passwordInput.classList.remove('text-red-500');
  passwordInput.classList.add('text-white');

  const url = API_ROUTES.AUTH.LOGIN;
  const method = 'POST';
  const payload = {
    nickname: nickname,
    password: password
  };

  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  Logger.debug('Response:', response);
  if (response.status === 200) {
    localStorage.setItem('nickname', nickname);
    Navigator.navigate('/play');
  } else {
    if (response.status !== 400) {
      showAlert(langTools.getText('unexpected-error'));
      return;
    }
    errorDiv.textContent = langTools.getText('login.invalid-nickname-or-password');
    errorDiv.classList.remove('hidden');
    nicknameInput.classList.add('text-red-500', 'animate-[shake_0.5s]');
    nicknameInput.classList.remove('text-white');
    passwordInput.classList.add('text-red-500', 'animate-[shake_0.5s]');
    passwordInput.classList.remove('text-white');
    passwordInput.blur()
    setTimeout(() => {
      nicknameInput.classList.remove('animate-[shake_0.5s]');
      passwordInput.classList.remove('animate-[shake_0.5s]');
      passwordInput.value = '';
    }, 500);
    setTimeout(() => {
      errorDiv.classList.add('hidden');
      nicknameInput.classList.remove('text-red-500');
      nicknameInput.classList.add('text-white');
      passwordInput.classList.remove('text-red-500');
      passwordInput.classList.add('text-white');
    }, 2000);
    const clearError = () => {
      errorDiv.classList.add('hidden');
      nicknameInput.classList.remove('text-red-500');
      nicknameInput.classList.add('text-white');
      passwordInput.classList.remove('text-red-500');
      passwordInput.classList.add('text-white');
      nicknameInput.removeEventListener('input', clearError);
      passwordInput.removeEventListener('input', clearError);
    };
    nicknameInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);
    if (onFail) onFail();
  }
}

export function handleSignUpInputEvent(e: Event) {
  e.preventDefault();
  Navigator.navigate('/signup');
}
