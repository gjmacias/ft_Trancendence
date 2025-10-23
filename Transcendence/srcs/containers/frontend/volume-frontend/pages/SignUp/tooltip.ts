import MyHtml from '@utils/MyHtml3';

export default class Tooltip {
  static createTooltip(offset: number, sibling: string): HTMLElement {
    const tooltip = MyHtml.div({
      class: `hidden
      absolute
      w-60 h-[79px]
      z-50
      px-2 py-1
      translate-x-[260px]
      text-black
      bg-[#f7f0c8]
      border-2 border-[#8a866e]
      rounded`,
      id: `${sibling}-tooltip`
    });
    tooltip.style.transform = `translateY(${offset * 80}px)`; // Adjust the offset based on the index
    return tooltip;
  }

  static showTooltip(tooltip: HTMLElement, message: string) {
    tooltip.textContent = message;
    tooltip.classList.remove('hidden');
  }

  static hideTooltip(tooltip: HTMLElement) {
    tooltip.classList.add('hidden');
  }
}
