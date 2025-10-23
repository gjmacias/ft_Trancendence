import MyHtml from '@utils/MyHtml';
import langTools from '@utils/LanguageTools';
import { API_ROUTES } from '@utils/api.routes';
import Navigator from '@/Navigator';

let toggleState: boolean = false; // Default state, can be fetched from the server

export default function createGdprContainer() {
    const container = MyHtml.div(
        `flex
        flex-col
        gap-4
        p-4`,
        '@id:gdpr-container'
    );
    const title = MyHtml.textElement(
        'h2',
        langTools.getText('profile.gdpr-title'),
        `gdpr-title
        text-3xl
        font-bold`
    );
    container.appendChild(title);
    const anonymizationItem = createAnonymizationItem();
    container.appendChild(anonymizationItem);
    const buttons = createGdprButtons();
    container.appendChild(buttons);
    return container;
}

function createGdprButtons() {
    const buttonsContainer = MyHtml.div(
        `flex
        flex-col
        md:flex-row
        items-center
        justify-center
        gap-2`
    );
    const viewDataButton = MyHtml.button(
        `bg-blue-500
        hover:bg-blue-600
        text-white
        font-semibold
        w-1/2
        py-2
        px-4
        rounded
        transition-colors
        duration-300`,
        '@type:button'
    );
    viewDataButton.textContent = langTools.getText('profile.gdpr-view-data-label');
    viewDataButton.addEventListener('click', viewDataDialog);
    buttonsContainer.appendChild(viewDataButton);
    const deleteButton = MyHtml.button(
        `bg-red-500
        hover:bg-red-600
        text-white
        font-semibold
        w-1/2
        py-2
        px-4
        rounded
        transition-colors
        duration-300`,
        '@type:button'
    );
    deleteButton.textContent = langTools.getText('profile.gdpr-account-deletion-label');
    deleteButton.addEventListener('click', deleteAccountDialog);
    buttonsContainer.appendChild(deleteButton);
    return buttonsContainer;
}

function createAnonymizationItem() {
    const item = MyHtml.div(
        `flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-2`
    );
    const label = MyHtml.textElement(
        'span',
        langTools.getText('profile.gdpr-anonymize-label'),
        `gdpr-anonymize-label
        text-lg
        font-semibold`
    );
    item.appendChild(label);
    const toggle = createGdprToggle();
    item.appendChild(toggle);
    return item;
}

function createGdprToggle() {
 // Default state, can be fetched from the server
    const toggleGDPR = MyHtml.label(
        `inline-flex
        items-center
        cursor-pointer`
    );
    // Hidden checkbox input for the toggle switch
    const toggleGDPRHiddenInput = MyHtml.input(
        '@type:checkbox',
        '@value:',
        `sr-only
        peer`
    );
    toggleGDPRHiddenInput.checked = toggleState; // Set the initial state
    toggleGDPR.appendChild(toggleGDPRHiddenInput);
    // Toggle switch background and handle
    const toggleGDPRSwitch = MyHtml.div(
        `relative
        w-16 h-8
        bg-gray-200
        peer-focus:outline-none
        peer-focus:ring-2
        peer-focus:ring-yellow-300
        rounded-full
        peer-checked:after:translate-x-[31px]
        rtl:peer-checked:after:-translate-x-full
        peer-checked:after:border-white
        after:content-['']
        after:absolute
        after:top-[2px]
        after:start-[2px]
        after:bg-white
        after:border-gray-300
        after:border
        after:rounded-full
        after:h-7
        after:w-7
        after:transition-all
        peer-checked:bg-yellow-500`
    );
    toggleGDPR.appendChild(toggleGDPRSwitch);
    toggleGDPR.addEventListener('change', toggleGDPRChangeHandler);
    return toggleGDPR;
}
async function toggleGDPRChangeHandler() {
    try {
        const response = await fetch(API_ROUTES.UPDATE.PRIVATE_COUNT, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ privateCount: !toggleState }), // Toggle the state
        });
        if (response.ok) {
          toggleState = !toggleState; // Toggle the state
          console.log(`GDPR anonymization is now ${toggleState ? 'enabled' : 'disabled'}`);
        }
      } catch (error) {
        console.error('Error toggling GDPR anonymization:', error);
      }
}

async function deleteAccountHandler(confirmationText: string) {
    try {
        console.log('Delete Account button clicked: ' + confirmationText);
        const dialog = document.getElementById('gdpr-delete-dialog') as HTMLDialogElement | null;
        if (dialog){
            console.log('Closing dialog');
            dialog.close();
            dialog.remove();
        }

        const response = await fetch(API_ROUTES.UPDATE.DELETE_INFORMATION, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ response: `${confirmationText}` }),
        });
        if (response.ok) {
          console.log('Account deletion request successful');
          window.location.reload();
          // Optionally, redirect the user or update the UI
        } else {
          console.error(`Account deletion request failed: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
}
function deleteAccountDialog() {
    const dialog = createDialog('500px', '250px') as HTMLDialogElement;
    dialog.id = 'gdpr-delete-dialog';
    document.body.appendChild(dialog);
    dialog.showModal();
    const title = MyHtml.textElement(
        'h2',
        langTools.getText('profile.gdpr-delete-confirmation-title'),
        `text-2xl
        font-bold
        center-text
        mb-4`
    );
    dialog.appendChild(title);

    const input = MyHtml.input(
        '@type:text',
        '@placeholder: ' + langTools.getText('profile.gdpr-delete-confirmation-input'),
        `w-full
        p-2`
    );
    dialog.appendChild(input);
    const buttonsContainer = MyHtml.div(
        `flex
        flex-col
        w-full
        md:flex-row
        items-center
        justify-center
        gap-2`
    );
    const cancelButton = MyHtml.button(
        `bg-blue-500
        hover:bg-blue-600
        text-white
        font-semibold
        w-1/3
        h-30px
        py-2
        px-4
        rounded
        transition-colors
        duration-300`,
        '@type:button'
    );
    cancelButton.textContent = langTools.getText('profile.gdpr-cancel-label');
    cancelButton.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
        console.log('Cancel button clicked');
        // Implement cancel functionality here
    });
    buttonsContainer.appendChild(cancelButton);
    const deleteButton = MyHtml.button(
        `bg-red-500
        hover:bg-red-600
        text-white
        font-semibold
        w-1/3
        h-30px
        py-2
        px-4
        rounded
        transition-colors
        duration-300`,
        '@type:button'
    );
    deleteButton.textContent = langTools.getText('profile.gdpr-delete-label');
    deleteButton.addEventListener('click', () => deleteAccountHandler(input.value));
    buttonsContainer.appendChild(deleteButton);
    dialog.appendChild(buttonsContainer);
}


async function viewDataDialog() {
    const dialog = createDialog('500px', '400px') as HTMLDialogElement;

    dialog.id = 'gdpr-view-data-dialog';
    document.body.appendChild(dialog);
    dialog.showModal();
    const userInfo = await fetch(API_ROUTES.UPDATE.GET_USER_INFORMATION, {
        method: 'GET',
        credentials: 'include',
    });
    const { nickname, email } = await userInfo.json();
    console.log('User Info:', nickname, email); // Debugging line

    const title = MyHtml.textElement(
        'h2',
        langTools.getText('profile.gdpr-view-data-dialog-title'),
        `text-2xl
        font-bold
        center-text
        mb-4`
    );
    dialog.appendChild(title);
    const usernameContainer = MyHtml.div(`
        mb-2
        w-full
        center-align
        items-center
        justify-between
        flex
        flex-col`
    );
    const usernameLabel = MyHtml.textElement(
        'span',
        langTools.getText('profile.gdpr-view-data-username'),
        `font-semibold`
    );
    usernameContainer.appendChild(usernameLabel);
    const usernameValue = MyHtml.div(
        `p-1
        font-['Press_Start_2P']
        w-4/5
        h-[40px]
        border
        border-gray-300
        rounded
        bg-grey-100
        break-words
        overflow-y-auto
        flex
        flex-row`
    );
    usernameValue.textContent = nickname;
    usernameContainer.appendChild(usernameValue);
    dialog.appendChild(usernameContainer);
    const emailContainer = MyHtml.div(`
        mb-2
        w-full
        center-align
        items-center
        justify-between
        flex
        flex-col`
    );

    const emailLabel = MyHtml.textElement(
        'span',
        langTools.getText('profile.gdpr-view-data-email') + ':',
        `font-semibold`
    );

    emailContainer.appendChild(emailLabel);

    const emailValue = MyHtml.div(
        `p-1
        font-['Press_Start_2P']
        w-4/5
        h-[40px]
        border
        border-gray-300
        rounded
        bg-grey-100
        break-words
        overflow-y-auto`
    );

    emailValue.textContent = email;
    emailContainer.appendChild(emailValue);
    dialog.appendChild(emailContainer);
    const closeButton = MyHtml.button(
        `bg-blue-500
        hover:bg-blue-600
        text-white
        font-semibold
        w-1/3
        h-[40px]
        py-2
        px-4
        rounded
        transition-colors
        duration-300`,
        '@type:button'
    );
    closeButton.textContent = langTools.getText('profile.gdpr-view-data-close-label');
    closeButton.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });
    dialog.appendChild(closeButton);
}

function createDialog(width : string, height : string) {
    const dialog = MyHtml.dialog(
        `p-4
        rounded
        shadow-lg
        bg-yellow-50
        border-4
        border-brown-300
        max-w-full
        max-h-full
        top-1/2
        left-1/2
        -translate-x-1/2
        -translate-y-1/2
        flex
        flex-col
        center-align
        items-center
        justify-between`
    );
    dialog.style.width = width;
    dialog.style.height = height;
    return dialog;
}