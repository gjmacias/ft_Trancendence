import MyHtml from '@utils/MyHtml3';

export default function create2FASettingItem(title: string, interactionElement: HTMLElement) {
  const settingsItem = MyHtml.div({
    class: `flex
    items-center
    justify-between`
  });
  const titleElement = MyHtml.span(title, {
    class: `two-factor-setting-label
    me-8
    text-lg
    font-semibold
    text-black`
  });
  settingsItem.appendChild(titleElement);
  settingsItem.appendChild(interactionElement);
  return settingsItem;
}
