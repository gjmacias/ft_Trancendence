import langTools from '@utils/LanguageTools';
import MyHtml from '@utils/MyHtml3';

export default function showAlert(message: string) {
  let customAlert = document.getElementById('custom-alert');
  if (!customAlert) {
    customAlert = createCustomAlert();
  }
  const messageSpan = customAlert.querySelector('#custom-alert-message');
  messageSpan!.textContent = message;
  customAlert.style.display = 'block';
}

function createCustomAlert(): HTMLElement {
  const customAlert = MyHtml.div({
    class: `fixed
    top-5
    left-1/2
    transform
    -translate-x-1/2
    bg-neutral-100
    text-neutral-800
    border
    border-blue-400
    px-4
    py-3
    rounded
    shadow-lg
    hidden
    z-100
    transition-opacity
    duration-300`,
    id: 'custom-alert'
  });
  const textMessage = MyHtml.span('', {
    class: 'block',
    id: 'custom-alert-message'
  });
  customAlert.appendChild(textMessage);
  const closeButton = MyHtml.button({
    class: `text-neutral-500 hover:text-neutral-700 bg-neutral-200 text-lg rounded-md font-bold mt-2 px-2 focus:outline-none`,
    text: langTools.getText('profile.gdpr-view-data-close-label')
  })
  closeButton.onclick = () => customAlert.remove();
  customAlert.appendChild(closeButton);
  document.body.appendChild(customAlert);
  return customAlert;
}
