import MyHtml from '@utils/MyHtml3';

export default function createSidebarDivider(): HTMLHRElement {
  const sidebarDivider = MyHtml.hr({
    class: `sidebar-divider border-t-2
    border-white/10`
  });
  return sidebarDivider;
}
