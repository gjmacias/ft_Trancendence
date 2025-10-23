import API_ROUTES from "@utils/api.routes";
import langTools from "@utils/LanguageTools";

type Attributes = Record<string, string>;

type ProfileDataType = {
  nicknameContainer: HTMLElement | null;
  passwordContainer: HTMLElement | null;
  currentNickname: string;
  mode: {
    password: 'view' | 'edit'; // 'view' or 'edit'
    nickname: 'view' | 'edit'; // 'view' or 'edit'
  };
  attr: {
    input: {
      enabled: Attributes;
      disabled: Attributes;
    };
    button: {
      submitMode: Attributes;
      editMode: Attributes;
    };
    cancel: {
      enabled: Attributes;
      disabled: Attributes;
    };
  };
  tooltip: {
    nickname: HTMLElement | null;
    password: HTMLElement | null;
  };
};

export const profileData: ProfileDataType = {
  nicknameContainer: null,
  passwordContainer: null,
  currentNickname: localStorage.getItem('nickname') || langTools.getText('profile.nickname'),
  mode: {
    password: 'view',
    nickname: 'view'
  },
  attr: {
    input: {
      enabled: {
        class: `<->
        bg-gray-700
        text-white/80
        pointer-events-none
        <+>
        bg-black
        text-white`,
        disabled: '<rm>'
      },
      disabled: {
        class: `<+>
        bg-gray-700
        text-white/80
        pointer-events-none
        <->
        bg-black
        text-white`,
        disabled: 'true'
      }
    },
    button: {
      submitMode: {
        class: `<+>
        bg-red-600
        hover:bg-red-700
        active:bg-red-800
        <->
        bg-blue-500
        hover:bg-blue-600
        active:bg-blue-700`,
        ariaLabel: 'Submit Update',
        text: langTools.getText('profile.submit-button-submit')
      },
      editMode: {
        class: `<->
        bg-red-600
        hover:bg-red-700
        active:bg-red-800
        <+>
        bg-blue-500
        hover:bg-blue-600
        active:bg-blue-700`,
        ariaLabel: 'Edit',
        text: langTools.getText('profile.submit-button-edit')
      }
    },
    cancel: {
      enabled: {
        class: `<-> invisible`
      },
      disabled: {
        class: `<+> invisible`
      }
    }
  },
  tooltip: {
    nickname: null,
    password: null
  }
};

// async function fetchNickname(): Promise<string> {
//   const response = await fetch(API_ROUTES.USER.NICKNAME);
//   if (!response.ok) {
//     throw new Error('Failed to fetch nickname');
//   }
//   const data = await response.json();
//   return data.nickname;
// }