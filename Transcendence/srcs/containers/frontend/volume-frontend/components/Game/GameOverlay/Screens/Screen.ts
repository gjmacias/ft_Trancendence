export default abstract class OverlayScreen {
  protected element: HTMLDivElement;

  constructor() {}

  public getElement(): HTMLDivElement {
    return this.element;
  }

  public show(...args: any[]): void {
    this.element.style.display = 'flex';
  }

  public hide(): void {
    this.element.style.display = 'none';
  }

  public remove(): void {
    if (this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
  }
}
