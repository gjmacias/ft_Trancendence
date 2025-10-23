import MyHtml from '@utils/MyHtml3';
import Logger from '@utils/Logger';

import createSidebarHeader from './sidebar.header';
import createSidebarDivider from './sidebar.divider';
import createSidebarList from './sidebar.items';
import createSidebarFooter from './sidebar.footer';

const sidebar = MyHtml.aside({
  class: 'flex z-10 w-[400px] h-screen flex-shrink-0 shadow-2xl/50',
  ariaLabel: 'Sidebar'
});
export function getSidebar(): HTMLElement {
  return sidebar;
}

export default function createSidebar(): HTMLElement {
  sidebar.innerHTML = '';
  const body = MyHtml.div({
    class: `flex
    flex-col
    w-full h-full
    p-6
    justify-start
    overflow-y-auto
    bg-[url('../../assets/decorative/sidebar_bg.png')]`
  });
  body.appendChild(createSidebarHeader());
  body.appendChild(createSidebarDivider());
  body.appendChild(createSidebarList());
  body.appendChild(createSidebarFooter());
  sidebar.appendChild(body);

  const sidebarBorder = MyHtml.div({
    class: `relative
    h-full w-2.5
    overflow-y-auto
    bg-[linear-gradient(_90deg,_rgba(100,100,100,1)_0%,_rgba(0,0,0,1)_20%,_rgba(0,0,0,1)_50%,_rgba(90,90,90,1)_85%,_rgba(210,210,210,1)_100%)]`,
  });
  sidebar.appendChild(sidebarBorder);

  return sidebar;
}
