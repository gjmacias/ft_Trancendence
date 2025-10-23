import MyHtml from '@utils/MyHtml3';
import Tooltip from './tooltip';
import { isNicknameTaken, isEmailTaken, sendSignUpRequest } from './signupApi';
import Navigator from '@/Navigator';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

interface formElement {
  value: string;
  valid: boolean;
  tooltipText: string;
  tooltip?: HTMLElement;
};

const formData: { [key: string]: formElement } = {
  nickname: {
    value: '',
    valid: false,
    tooltipText: '',
    tooltip: undefined
  },
  email: {
    value: '',
    valid: false,
    tooltipText: '',
    tooltip: undefined
  },
  password: {
    value: '',
    valid: false,
    tooltipText: '',
    tooltip: undefined
  },
  confirmPassword: {
    value: '',
    valid: false,
    tooltipText: '',
    tooltip: undefined
  }
};

export default function createForm(): HTMLElement {
  const form = MyHtml.form({
    class: `z-20
    flex flex-col
    items-center justify-start
    size-auto`,
    id: 'signup-form'
  });
  initialiseFormData(formData);
  createNicknameInput(form);
  createEmailInput(form);
  createPasswordInput(form);
  createConfirmPasswordInput(form);
  createRegisterButton(form);
  return form;
}

function initialiseFormData(data: typeof formData) {
  data.nickname.value = '';
  data.nickname.valid = false;
  data.nickname.tooltipText = '';
  data.nickname.tooltip = undefined;

  data.email.value = '';
  data.email.valid = false;
  data.email.tooltipText = '';
  data.email.tooltip = undefined;

  data.password.value = '';
  data.password.valid = false;
  data.password.tooltipText = '';
  data.password.tooltip = undefined;

  data.confirmPassword.value = '';
  data.confirmPassword.valid = false;
  data.confirmPassword.tooltipText = '';
  data.confirmPassword.tooltip = undefined;
}

function createFormInput(name: string, eventListener: EventListener): HTMLInputElement {
  let inputType: string;
  if (name === 'confirm password' || name === 'password') {
    inputType = 'password';
  } else if (name === 'email') {
    inputType = 'email';
  } else {
    inputType = 'text';
  }
  const input = MyHtml.input({
    class: `w-[80%]
    font-['Press_Start_2P']
    py-4 px-3
    m-4
    text-xs
    bg-black
    border-none outline-none
    rounded-lg
    text-white
    placeholder:text-neutral-400`,
    type: inputType,
    name: name,
    placeholder: langTools.getText(`signup.form-${name.toLowerCase().replace(' ', '-')}`),
    required: 'true',
    ariaLabel: name
  });
  input.addEventListener('blur', eventListener);
  return input;
}

function createNicknameInput(form: HTMLElement) {
  const nicknameInput = createFormInput('nickname', nicknameBlurEventHandler);
  form.appendChild(nicknameInput);
  formData.nickname.tooltip = Tooltip.createTooltip(0, 'nickname');
  form.appendChild(formData.nickname.tooltip);
}

function createEmailInput(form: HTMLElement) {
  const emailInput = createFormInput('email', emailBlurEventHandler);
  form.appendChild(emailInput);
  formData.email.tooltip = Tooltip.createTooltip(1, 'email');
  form.appendChild(formData.email.tooltip);
}

function createPasswordInput(form: HTMLElement) {
  const passwordInput = createFormInput('password', passwordBlurEventHandler);
  form.appendChild(passwordInput);
  formData.password.tooltip = Tooltip.createTooltip(2, 'password');
  form.appendChild(formData.password.tooltip);
}

function createConfirmPasswordInput(form: HTMLElement) {
  const confirmPasswordInput = createFormInput('confirm password', confirmPasswordBlurEventHandler);
  form.appendChild(confirmPasswordInput);
  formData.confirmPassword.tooltip = Tooltip.createTooltip(3, 'confirm_password');
  form.appendChild(formData.confirmPassword.tooltip);
}

import RegisterButton from './RegisterButton';
import showAlert from '@components/showAlert';

function createRegisterButton(form: HTMLElement) {
  const button = RegisterButton.create();
  const registerTooltip = Tooltip.createTooltip(4, 'register_button');
  registerTooltip.textContent = langTools.getText('signup.complete-all-fields');
  form.appendChild(button);
  form.appendChild(registerTooltip);

  button.addEventListener('click', registerButtonClickHandler);

  button.addEventListener('mouseenter', () => {
    const isFormValid = formData.nickname.valid &&
      formData.email.valid &&
      formData.password.valid &&
      formData.confirmPassword.valid;
    if (!isFormValid && button.disabled && registerTooltip) {
      registerTooltip.classList.remove('hidden');
    }
  });

  button.addEventListener('mouseleave', () => {
    if (registerTooltip) {
      registerTooltip.classList.add('hidden');
    }
  });
}

async function registerButtonClickHandler(e: Event) {
  e.preventDefault();

  if (!isFormValid(formData)) {
    Logger.warn('Form is invalid');
    return;
  }

  const payload = {
    nickname: formData.nickname.value,
    email: formData.email.value,
    password: formData.password.value
  }
  const userId = await sendSignUpRequest(payload);
  if (userId === -1) {
    showAlert(langTools.getText('unexpected-error'));
  } else {
    Logger.log('Registration successful!');
    Logger.log('User ID:', userId);
    Navigator.navigate('/login');
  }
}

async function nicknameBlurEventHandler(event: Event) {
  const input = event.target as HTMLInputElement;
  const tooltip = formData.nickname.tooltip as HTMLElement;

  input.value = input.value.trim();
  formData.nickname.value = input.value;
  formData.nickname.valid = await validateNickname(formData);

  if (formData.nickname.tooltipText !== '') {
    Tooltip.showTooltip(tooltip, formData.nickname.tooltipText);
  } else {
    Tooltip.hideTooltip(tooltip);
  }

  const registerButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  const isFormValid = formData.nickname.valid &&
    formData.email.valid &&
    formData.password.valid &&
    formData.confirmPassword.valid;
  RegisterButton.setState(registerButton, isFormValid);
}

async function emailBlurEventHandler(event: Event) {
  const input = event.target as HTMLInputElement;
  const tooltip = formData.email.tooltip as HTMLElement;
  formData.email.value = input.value.trim();
  formData.email.valid = await validateEmail(formData);

  if (formData.email.tooltipText !== '') {
    Tooltip.showTooltip(tooltip, formData.email.tooltipText);
  } else {
    Tooltip.hideTooltip(tooltip);
  }

  const registerButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  const isFormValid = formData.nickname.valid &&
    formData.email.valid &&
    formData.password.valid &&
    formData.confirmPassword.valid;
  RegisterButton.setState(registerButton, isFormValid);
}


function passwordBlurEventHandler(event: Event) {
  const input = event.target as HTMLInputElement;
  const tooltip = formData.password.tooltip as HTMLElement;
  formData.password.value = input.value;
  formData.password.valid = validatePassword(formData);

  if (formData.password.tooltipText !== '') {
    Tooltip.showTooltip(tooltip, formData.password.tooltipText);
  } else {
    Tooltip.hideTooltip(tooltip);
  }

  const confirmPasswordInput = document.querySelector('input[name="confirm password"]') as HTMLInputElement;
  formData.confirmPassword.value = confirmPasswordInput.value;
  formData.confirmPassword.valid = validateConfirmPassword(formData);

  const confirmTooltip = formData.confirmPassword.tooltip as HTMLElement;
  if (formData.confirmPassword.tooltipText !== '') {
    Tooltip.showTooltip(confirmTooltip, formData.confirmPassword.tooltipText);
  } else {
    Tooltip.hideTooltip(confirmTooltip);
  }

  const registerButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  const isFormValid = formData.nickname.valid &&
    formData.email.valid &&
    formData.password.valid &&
    formData.confirmPassword.valid;
  RegisterButton.setState(registerButton, isFormValid);
}

function confirmPasswordBlurEventHandler(event: Event) {
  const input = event.target as HTMLInputElement;
  const tooltip = formData.confirmPassword.tooltip as HTMLElement;
  formData.confirmPassword.value = input.value;
  formData.confirmPassword.valid = validateConfirmPassword(formData);

  if (formData.confirmPassword.tooltipText !== '') {
    Tooltip.showTooltip(tooltip, formData.confirmPassword.tooltipText);
  } else {
    Tooltip.hideTooltip(tooltip);
  }

  const registerButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  const isFormValid = formData.nickname.valid &&
    formData.email.valid &&
    formData.password.valid &&
    formData.confirmPassword.valid;
  RegisterButton.setState(registerButton, isFormValid);
}

async function validateNickname(form: typeof formData): Promise<boolean> {
  const nickname = form.nickname.value;
  if (nickname.length === 0) {
    form.nickname.tooltipText = '';
    return false;
  }
  if (nickname.length < 3) {
    form.nickname.tooltipText = langTools.getText('signup.nickname-too-short');
    return false;
  }
  if (/^\./.test(nickname)) {
    form.nickname.tooltipText = langTools.getText('signup.nickname-period-start');
    return false;
  }
  if (/\.$/.test(nickname)) {
    form.nickname.tooltipText = langTools.getText('signup.nickname-period-end');
    return false;
  }
  if (/^[0-9]+$/.test(nickname)) {
    form.nickname.tooltipText = langTools.getText('signup.nickname-only-numbers');
    return false;
  }
  if (!/^[A-Za-z0-9_.]+$/.test(nickname)) {
    form.nickname.tooltipText = langTools.getText('signup.nickname-invalid-character');
    return false;
  }

  if (await isNicknameTaken(nickname)) {
    form.nickname.tooltipText = langTools.getText('signup.nickname-taken');
    return false;
  }

  form.nickname.tooltipText = '';
  return true;
}

async function validateEmail(form: typeof formData): Promise<boolean> {
  const email = form.email.value;
  if (email.length === 0) {
    form.email.tooltipText = '';
    return false;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    form.email.tooltipText = langTools.getText('signup.email-invalid');
    return false;
  }

  if (await isEmailTaken(email)) {
    form.email.tooltipText = langTools.getText('signup.email-taken');
    return false;
  }

  form.email.tooltipText = '';
  return true;
}

function validatePassword(form: typeof formData): boolean {
  const password = form.password.value;
  const nickname = form.nickname.value;
  if (password.length === 0) {
    form.password.tooltipText = '';
    return false;
  }
  if (password.length < 8) {
    form.password.tooltipText = langTools.getText('signup.password-too-short');
    return false;
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    form.password.tooltipText = langTools.getText('signup.password-letters-and-numbers');
    return false;
  }
  if (nickname && password.toLowerCase().includes(nickname.toLowerCase())) {
    form.password.tooltipText = langTools.getText('signup.password-contains-nickname');
    return false;
  }
  form.password.tooltipText = '';
  return true;
}

function validateConfirmPassword(form: typeof formData): boolean {
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  if (confirmPassword.length === 0) {
    form.confirmPassword.tooltipText = '';
    return false;
  }
  if (password !== '' && password !== confirmPassword) {
    form.confirmPassword.tooltipText = langTools.getText('signup.confirm-password-mismatch');
    return false;
  }
  form.confirmPassword.tooltipText = '';
  return true;
}

async function isFormValid(data: typeof formData): Promise<boolean> {
  formData.nickname.valid = await validateNickname(formData);
  formData.email.valid = await validateEmail(formData);
  formData.password.valid = await validatePassword(formData);
  formData.confirmPassword.valid = await validateConfirmPassword(formData);
  return data.nickname.valid &&
    data.email.valid &&
    data.password.valid &&
    data.confirmPassword.valid;
}
