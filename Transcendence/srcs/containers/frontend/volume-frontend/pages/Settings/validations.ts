import Tooltip from '@pages/SignUp/tooltip';
import langTools from '@utils/LanguageTools';

export function validatePassword(password: string, tooltip: HTMLElement): boolean {
  if (password.length === 0) {
    Tooltip.hideTooltip(tooltip);
    return false;
  }
  if (password.length < 8) {
    Tooltip.showTooltip(tooltip, langTools.getText('signup.password-too-short'));
    return false;
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    Tooltip.showTooltip(tooltip, langTools.getText('signup.password-letters-and-numbers'));
    return false;
  }
  Tooltip.hideTooltip(tooltip);
  return true;
}

export function validateNickname(nickname: string, tooltip: HTMLElement): boolean {
  if (nickname.length === 0) {
    Tooltip.hideTooltip(tooltip);
    return false;
  }
  if (nickname.length < 3) {
    Tooltip.showTooltip(tooltip, langTools.getText('signup.nickname-too-short'));
    return false;
  }
  if (/^\./.test(nickname)) {
    Tooltip.showTooltip(tooltip, langTools.getText('signup.nickname-period-start'));
    return false;
  }
  if (/\.$/.test(nickname)) {
    Tooltip.showTooltip(tooltip, langTools.getText('signup.nickname-period-end'));
    return false;
  }
  if (/^[0-9]+$/.test(nickname)) {
    Tooltip.showTooltip(tooltip, langTools.getText('signup.nickname-only-numbers'));
    return false;
  }
  if (!/^[A-Za-z0-9_.]+$/.test(nickname)) {
    Tooltip.showTooltip(tooltip, langTools.getText('signup.nickname-invalid-character'));
    return false;
  }

  Tooltip.hideTooltip(tooltip);
  return true;
}
