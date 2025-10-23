import createSidebar from '@components/Sidebar/sidebar';
import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import { root } from '../main';

export default function createBasicPageLayout(pageId: string): HTMLElement {
  const pageTitle = langTools.getText(`${pageId}.page-title`);
  MyHtml.resetElement(root, {
    class: `flex
    min-h-screen min-w-screen
    bg-mainYellow
    overflow-hidden`
  });
  const sidebar = createSidebar();
  root.appendChild(sidebar);
  const main = createMain();
  root.appendChild(main);
  const header = createHeader(pageTitle);
  main.appendChild(header);
  const content = createContentArea();
  main.appendChild(content);
  return content;
}

function createMain() {
  const main = MyHtml.main({
    id: 'main-content',
    class: `main-container
    flex flex-col
    h-screen
    flex-1`
  });
  return main;
}

function createHeader(label: string): HTMLDivElement {
  const header = MyHtml.div({
    class: `header-area
    flex
    items-center
    justify-center
    mb-4`
  });
  const logo = MyHtml.svgIcon({
    href: 'logo',
    alt: 'Logo',
    class: `logo
    h-40 w-40
    mt-2`
  });
  header.appendChild(logo);
  const title = MyHtml.h1(label, {
    class: `page-title
    text-7xl
    font-bold`
  });
  header.appendChild(title);
  return header;
}

function createContentArea(): HTMLDivElement {
  const content = MyHtml.div({
    class: `content-area
    flex flex-col
    flex-1
    items-center
    border-2`
  });
  return content;
}
