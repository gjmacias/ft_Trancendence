import MyHtml from '@utils/MyHtml3';

export default function createSidebarHeader(): HTMLDivElement {
  const header = MyHtml.div({
    class: `flex
    justify-center
    mb-4`,
    id: 'sidebar-header'
  });
  const logo = MyHtml.img({
    src: '/assets/logo/logo.svg',
    class: `h-20
    me-4
    transition-all
    duration-300
    ease-in-out
    hover:scale-110
    hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.4)]
    cursor-pointer`,
    id: 'sidebar-logo',
    alt: 'Logo',
  });
  header.appendChild(logo);

  const title = MyHtml.h1('Transcendence', {
    class: `self-center
    text-3xl
    font-semibold
    whitespace-nowrap
    text-white`
  });
  header.appendChild(title);

  return header;
}
