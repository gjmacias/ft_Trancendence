import { profileData } from './profileData';
import MyHtml from '@utils/MyHtml3';

export function toggleMode(dataType: 'nickname' | 'password'): void {
  const container = dataType === 'nickname' ? profileData.nicknameContainer : profileData.passwordContainer;
  const button = container.querySelector('.submit-button') as HTMLButtonElement;
  const cancelButton = container.querySelector('.cancel-button') as HTMLButtonElement;
  const input = container.querySelector('input') as HTMLInputElement;
  if (profileData.mode[dataType] === 'view') { // If on view mode, we should switch to edit mode
    MyHtml.setAttributes(input, profileData.attr.input.enabled);
    MyHtml.setAttributes(button, profileData.attr.button.submitMode);
    MyHtml.setAttributes(cancelButton, profileData.attr.cancel.enabled);
    profileData.mode[dataType] = 'edit';
  } else { // If on edit mode, we should switch to view mode
    MyHtml.setAttributes(input, profileData.attr.input.disabled);
    MyHtml.setAttributes(button, profileData.attr.button.editMode);
    MyHtml.setAttributes(cancelButton, profileData.attr.cancel.disabled);
    input.value = '';
    profileData.mode[dataType] = 'view';
  }
}
