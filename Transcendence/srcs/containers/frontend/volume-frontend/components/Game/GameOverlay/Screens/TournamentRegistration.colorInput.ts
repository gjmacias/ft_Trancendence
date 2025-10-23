import MyHtml from '@utils/MyHtml3';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';

const colorPickerInput =  MyHtml.input({
  type: 'color',
  id: 'color-picker-input',
  class: `color-picker-input
  h-full
  aspect-square
  cursor-pointer
  rounded-md
  border`,
  value: '#808080'
});
const colorTextInput = MyHtml.input({
  type: 'text',
  id: 'color-hex',
  placeholder: '#RRGGBB',
  class: `color-text-input
  w-full
  rounded-md
  border
  bg-white
  px-3
  py-2
  text-lg
  focus:ring-2
  focus:ring-blue-500
  focus:outline-none`
});

export function getColorPickerInput(): HTMLInputElement {
  return colorPickerInput;
}
export function getColorTextInput(): HTMLInputElement {
  return colorTextInput;
}

export default function createColorPickerInput(registryBox: HTMLElement) {
  const colorPickerContainer = MyHtml.div({
    class: `mb-6
    flex
    items-center
    justify-between`,
    id: 'color-picker-container'
  });
  const colorInputContainer = MyHtml.div({
    class: `flex
    mr-4`,
    id: 'color-input-container'
  });
  colorPickerContainer.appendChild(colorInputContainer);
  const colorInputLabel = MyHtml.label({
    text: langTools.getText('tournament.color-input-label'),
    for: 'color-hex',
    class: `color-input-label
    mb-1
    block
    text-lg
    font-medium`,
    id: 'color-input-label'
  });
  colorInputContainer.appendChild(colorInputLabel);
  colorInputLabel.appendChild(colorTextInput);
  colorPickerContainer.appendChild(colorPickerInput);
  colorPickerInput.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    const color = target.value;
    colorTextInput.value = color;
    const adjustedColor = adjustColor(color);
    registryBox.style.backgroundColor = adjustedColor;
    const addButton = document.getElementById('add-player-button');
    addButton?.focus();
  });
  colorPickerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      const color = target.value;
      colorTextInput.value = color;
      const adjustedColor = adjustColor(color);
      registryBox.style.backgroundColor = adjustedColor;
      const addButton = document.getElementById('add-player-button');
      addButton?.focus();
    }
  });
  colorTextInput.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    const color = target.value;
    if (/^#([0-9A-Fa-f]{6})$/.test(color)) {
      colorPickerInput.value = color;
      const adjustedColor = adjustColor(color);
      registryBox.style.backgroundColor = adjustedColor;
    }
    const addButton = document.getElementById('add-player-button');
    addButton?.focus();
  });

  return colorPickerContainer;
}

function adjustColor(color: string): string {
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  const minimumBrightness = 65;
  const brightness = Math.floor((r * 299 + g * 587 + b * 114) / 1000);

  if (brightness <= minimumBrightness) {
    r += minimumBrightness - brightness;
    g += minimumBrightness - brightness;
    b += minimumBrightness - brightness;
  }
  const adjustedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  return adjustedColor;
}
