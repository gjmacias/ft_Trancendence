import MyHtml from '@utils/MyHtml3';
import { API_ROUTES } from '@utils/api.routes';
import Logger from '@utils/Logger';

let toggleState: boolean = false; // Default state, can be fetched from the server

export default async function create2FAToggle() {
  toggleState = await get2faState();
  const toggle2FA = MyHtml.label({
    class: `inline-flex
    items-center
    cursor-pointer`
  });
  // Hidden checkbox input for the toggle switch
  const toggle2FAHiddenInput = MyHtml.input({
    type: 'checkbox',
    value: '',
    class: `sr-only
    peer`
  });
  toggle2FAHiddenInput.checked = toggleState; // Set the initial state
  toggle2FA.appendChild(toggle2FAHiddenInput);
  // Toggle switch background and handle
  const toggle2FASwitch = MyHtml.div({
    class: `relative
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
  });
  toggle2FA.appendChild(toggle2FASwitch);
  toggle2FA.addEventListener('change', toggle2FAChangeHandler);
  return toggle2FA;
}

async function toggle2FAChangeHandler() {
  try {
    const response = await fetch(API_ROUTES.UPDATE.TOGGLE_2FA, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: !toggleState }), // Toggle the state
    });
    if (response.ok) {
      toggleState = !toggleState; // Toggle the state

    }
  } catch (error) {
    Logger.error('Error toggling 2FA:', error);
  }
}

async function get2faState(): Promise<boolean> {
  try {
    const response = await fetch(API_ROUTES.AUTH.GET_2FA_STATE);
    if (response.ok) {
      const data = await response.json();
      return data.active_2FA;
    }
  } catch (error) {
    Logger.error('Error fetching 2FA state:', error);
  }
  return false; // Default to false if there's an error or no data
}
