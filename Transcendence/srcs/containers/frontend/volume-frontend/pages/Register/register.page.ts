import MyHtml from '@utils/MyHtml3';
import Logger from '@utils/Logger';

// Unused
export default function completeRegistrationPageRender(root: HTMLElement) {
  Logger.info('completeRegistrationPageRender called');
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
    border-2 border-black
    `
  });
  root.appendChild(contentArea);

  const title = MyHtml.h1('Scan this QR code with your 2FA app', {
    class: `text-9xl
    font-bold
    mb-16`
  });
  contentArea.appendChild(title);

  const verificationContainer = MyHtml.div({
    class: `verification-container
    flex
    items-center
    justify-center
    gap-4
    border-2 border-blue-700
    `
  });
  contentArea.appendChild(verificationContainer);

  const qrCode = MyHtml.div({
    class: `qr-code
    w-380 h-380
    bg-gray-900
    flex items-center justify-center
    border-2 border-gray-800
    `
  });
  verificationContainer.appendChild(qrCode);

  const codeInputContainer = MyHtml.div({
    class: `code-input-container
    flex flex-col
    h-full
    items-center
    justify-center
    border-2 border-gray-800
    p-4
    `
  });
  verificationContainer.appendChild(codeInputContainer);

  const codeInputLabel = MyHtml.label({
    text: 'Enter the 6-digit code here:',
    class: `text-8xl
    mb-4`
  });
  codeInputContainer.appendChild(codeInputLabel);

  const codeInput = MyHtml.input({
    class: `code-input
    border-2 border-gray-800
    rounded-lg
    text-stone-800
    bg-stone-200
    p-8
    w-240
    h-80
    text-[16rem]`,
    type: 'text',
    maxlength: '6',
    required: 'true'
  });
  codeInputContainer.appendChild(codeInput);

  const submitButton = MyHtml.button({
    class: `submit-button
    bg-blue-600
    text-white
    text-8xl
    px-8 py-4
    mt-8
    rounded-lg
    hover:bg-blue-700
    transition-colors`,
    text: 'Submit'
  });
  codeInputContainer.appendChild(submitButton);
}
