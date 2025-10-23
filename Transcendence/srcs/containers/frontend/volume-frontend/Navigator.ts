import router from '@/router';
import Logger from '@utils/Logger';

export default class Navigator {
  private constructor() {}

  private static internalNavigationEnabled: boolean = true;

  private static currentPath: string = window.location.pathname;

  public static init(): void {
    window.addEventListener('popstate', () => {
      Navigator.navigate(window.location.pathname, false);
    });
    router();
  }

  public static navigate(path: string, history: boolean =  true): void {
    if (history) {
      Navigator.addToHistory(path);
    }
    if (Navigator.getInternalNavigation() === false) {
      window.location.reload();
      return;
    }
    router();
  }

  public static openInNewTab(path: string): void {
    const url = `${window.location.origin}${path}`;
    window.open(url, '_blank');
  }

  private static addToHistory(path: string): void {
    window.history.pushState({}, '', path);
  }

  public static setInternalNavigation(enabled: boolean): void {
    Navigator.internalNavigationEnabled = enabled;
  }
  public static getInternalNavigation(): boolean {
    return Navigator.internalNavigationEnabled;
  }
}
