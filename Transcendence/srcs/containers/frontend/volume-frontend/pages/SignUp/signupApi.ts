import API_ROUTES from '@utils/api.routes';
import Logger from '@utils/Logger';

export async function isNicknameTaken(nickname: string): Promise<boolean> {
  const url = API_ROUTES.AUTH.WATCH_NICKNAME(nickname);
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      return false;
    } else if (response.status === 400) {
      return true;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    Logger.error(error.message);
  }
  return true;
}

export async function isEmailTaken(email: string): Promise<boolean> {
  const url = API_ROUTES.AUTH.WATCH_EMAIL(email);
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      return false;
    } else if (response.status === 400) {
      return true;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    Logger.error(error.message);
  }
  return true;
}

export async function sendSignUpRequest(payload: Record<string, any> = {}): Promise<number> {
  const url = API_ROUTES.AUTH.SIGNUP;
  const method = 'POST';
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.status === 201) {
      const data = await response.json();
      return data.id;
    }
    Logger.warn('Registration response was not 201, but still ok:', response.status);
  } catch (error) {
    Logger.error('Registration failed:', error);
    return -1;
  }
}
