import MyHtml from '@utils/MyHtml3';
import { pages } from '@/pages';
import langTools from '@utils/LanguageTools';
import Navigator from '@/Navigator';

export default function createSidebarList(): HTMLUListElement {
  const itemsList = MyHtml.ul({
    class: `relative
    text-xl
    mx-4 mt-4
    space-y-4
    overflow-y-auto`,
    id: 'sidebar-items-list'
  });
  Object.values(pages).forEach(page => {
    if (page.inSidebar) {
      const item = createSidebarItem(page.id);
      itemsList.appendChild(item);
    }
  });
  return itemsList;
}

function createSidebarItem(pageId: string): HTMLLIElement {
  const name = langTools.getText(`sidebar.${pageId}`);
  const item = MyHtml.li({
    class: `sidebar-item`,
    id: pageId
  });
  const anchor = MyHtml.a({
    href: '',
    class: `flex
    items-center
    justify-center
    p-4
    text-white
    font-semibold
    rounded-md
    dark:text-white
    hover:bg-white/10`,
    id: `sidebar-anchor-${pageId}`
  });
  item.appendChild(anchor);
  anchor.addEventListener('click', (event) => {
    event.preventDefault();
    Navigator.navigate(`/${pageId}`);
  });
  anchor.addEventListener('auxclick', (event) => {
    if (event.button === 1) {
      event.preventDefault();
      Navigator.openInNewTab(`/${pageId}`);
    }
  });
  const itemLabel = MyHtml.span(name);
  anchor.appendChild(itemLabel);
  return item;
}
