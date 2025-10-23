import QRCode from 'qrcode';
import MyHtml from '@utils/MyHtml3';
import API_ROUTES from '@utils/api.routes';
import Navigator from '@/Navigator'
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

import { createLogoutButton } from '@components/Sidebar/sidebar.footer';

export default function verifyPageRender(root: HTMLElement) {
  MyHtml.resetElement(root, {
    class: `flex
    relative
    min-h-screen min-w-screen
    place-content-center
    bg-[#fee25b]
    overflow-hidden`
  });

  const gradientOverlay = MyHtml.div({
    class: `absolute
    top-0 left-0
    h-full w-full
    bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,0.2)_100%)]
    pointer-events-none
    z-10`
  });
  root.appendChild(gradientOverlay);

  const contentArea = MyHtml.div({
    class: `content-area
    flex flex-col
    self-center
    `
  });
  root.appendChild(contentArea);

  const languageSelector = langTools.createLanguageSelector('absolute top-4 right-4');
  contentArea.appendChild(languageSelector);
  const logoutButton = createLogoutButton();
  MyHtml.setAttributes(logoutButton, {
    class: `<-> hover:bg-white/10
    <+>
    absolute
    top-4 left-4
    bg-yellow-500/60
    hover:bg-yellow-600/60`
  });
  contentArea.appendChild(logoutButton);

  const title = MyHtml.h1(langTools.getText('verify.page-title'), {
    class: `text-6xl
    text-center
    font-bold
    mb-12`
  });
  contentArea.appendChild(title);

  const verificationContainer = MyHtml.div({
    class: `verification-container
    flex
    items-center
    justify-center
    gap-4
    `
  });
  contentArea.appendChild(verificationContainer);

  const qrContainerX = MyHtml.div({
    class: `qr-container-x
    flex flex-col
    items-center justify-center
    w-180
    h-205
    hidden
    `
  });
  verificationContainer.appendChild(qrContainerX);

  const qrTitle = MyHtml.h2(langTools.getText('verify.qr-title'), {
    class: `text-4xl
    mb-6
    font-semibold
    text-left
    self-start`
  });
  qrContainerX.appendChild(qrTitle);

  const qrCodeContainer = MyHtml.div({
    class: `qr-code-container
    w-180 h-180
    bg-gray-900
    flex items-center justify-center
    `
  });
  qrContainerX.appendChild(qrCodeContainer);

  const url = localStorage.getItem('2FA_QR');
  if (url) {
    MyHtml.setAttributes(qrContainerX, { class: '<-> hidden' });
    QRCode.toDataURL(url)
      .then((qrImgUrl) => {
        const img = MyHtml.img({
          src: qrImgUrl,
          class: `qr-code
          w-full h-full
          object-contain`,
          alt: '2FA QR Code'
        });
        qrCodeContainer.appendChild(img);
      })
      .catch((err) => {
        Logger.error('Error generating QR code:', err);
      });
  }

  const codeInputContainer = MyHtml.div({
    class: `code-input-container
    flex flex-col
    h-full
    items-center
    justify-center
    p-4
    `
  });
  verificationContainer.appendChild(codeInputContainer);

  const codeInputLabel = MyHtml.label({
    text: langTools.getText('verify.code-input-label'),
    class: `w-full max-w-190
    text-4xl
    mb-6`
  });
  codeInputContainer.appendChild(codeInputLabel);

  const codeInput = MyHtml.input({
    class: `code-input
    border-2 border-gray-800
    rounded-lg
    text-stone-800
    bg-stone-200
    p-8
    w-190
    h-60
    text-[12rem]`,
    type: 'text',
    maxlength: '6',
    required: 'true'
  });
  codeInputContainer.appendChild(codeInput);
  codeInput.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      submitButtonClickHandler(event as unknown as MouseEvent);
    }
  });

  const submitButton = MyHtml.button({
    class: `submit-button
    bg-blue-600
    text-white
    text-6xl
    px-8 py-4
    mt-8
    rounded-lg
    hover:bg-blue-700
    transition-colors`,
    text: langTools.getText('verify.submit-button')
  });
  submitButton.addEventListener('click', submitButtonClickHandler);
  codeInputContainer.appendChild(submitButton);
}

async function submitButtonClickHandler(event: MouseEvent) {
  event.preventDefault();
  const codeInput = document.querySelector('.code-input') as HTMLInputElement;
  const code = codeInput.value.trim();
  if (code.length !== 6) {
    invalidInput();
    return;
  }
  if (!/^\d{6}$/.test(code)) {
    invalidInput();
    return;
  }

  const response = await fetch(API_ROUTES.AUTH.CALLBACK_2FA, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ code })
  });
  if (response.ok) {
    Navigator.navigate('/');
  } else {
    invalidInput();
  }
}

function invalidInput() {
  const codeInput = document.querySelector('.code-input') as HTMLInputElement;
  MyHtml.setAttributes(codeInput, {
    class: `<+>
    border-red-500
    text-red-800
    bg-red-100
    <->
    border-gray-800
    text-stone-800
    bg-stone-200`
  });
  codeInput.value = '';
  setTimeout(() => {
    MyHtml.setAttributes(codeInput, {
      class: `<->
      border-red-500
      text-red-800
      bg-red-100
      <+>
      border-gray-800
      text-stone-800
      bg-stone-200`
    });
  }, 2000);
}
