import translationsData from '@utils/translations.json';
import MyHtml from '@utils/MyHtml3';

type Language = 'en' | 'es' | 'ca';

class LanguageTools {
  private isSet: boolean = false;
  private language: Language = 'en';
  private translations: any;

  constructor() {
    this.parseTranslationsJSON();
  }

  private parseTranslationsJSON() {
    this.translations = translationsData;
  }

  public getText(path: string): string {
    if (!this.isLanguageSet()) {
      this.initUserLanguage();
    }
    const keys = path.split('.');
    let obj = this.translations;
    for (const key of keys) {
      const normalizedKey = key.toLowerCase();
      if (!obj[normalizedKey]) return '';
      obj = obj[normalizedKey];
    }
    return obj[this.language] || 'ERROR';
  }

  public getUserLanguage(): Language {
    if (!this.isLanguageSet()) {
      this.initUserLanguage();
    }
    return this.language;
  }

  public initUserLanguage(): void {
    this.isSet = true;
    const localStorageLang: Language | null = this.getLocalStorageLanguage();
    if (localStorageLang) {
      this.language = localStorageLang;
      return;
    }

    const navigatorLanguage = this.getNavigatorLanguage();
    this.language = navigatorLanguage;
  }

  private getLocalStorageLanguage(): Language | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedLang = window.localStorage.getItem('preferredLanguage') as Language | null;
      if (storedLang === 'en' || storedLang === 'es' || storedLang === 'ca') {
        return storedLang;
      }
    }
    return null;
  }

  private getNavigatorLanguage(): Language {
    const navigatorLanguage = navigator.language.slice(0, 2);
    if (navigatorLanguage === 'es' || navigatorLanguage === 'ca') {
      return navigatorLanguage as Language;
    }
    return 'en' as Language;
  }

  public setLanguage(lang: Language): void {
    this.language = lang;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('preferredLanguage', lang);
    }
  }

  private isLanguageSet(): boolean {
    return this.isSet;
  }

  public createLanguageSelector(extraClasses?: string): HTMLSelectElement {
    const select = MyHtml.select({
      class: `bg-white/50
      text-neutral-950
      rounded-sm
      hover:bg-white/75
      transition-colors
      duration-300
      p-1.5
      pr-2.5
      z-20`,
      id: 'language-selector',
      ariaLabel: 'Select Language'
    });
    if (extraClasses) {
      MyHtml.setClasses(select, extraClasses);
    }

    const optionEN = MyHtml.option({
      value: 'en',
      text: 'English'
    });
    const optionES = MyHtml.option({
      value: 'es',
      text: 'Español'
    });
    const optionCA = MyHtml.option({
      value: 'ca',
      text: 'Català'
    });

    select.appendChild(optionEN);
    select.appendChild(optionES);
    select.appendChild(optionCA);

    const currentLanguage = langTools.getUserLanguage();
    select.value = currentLanguage;

    select.addEventListener('change', (event) => {
      const target = event.target as HTMLSelectElement;
      const selectedLanguage = target.value as 'en' | 'es' | 'ca';
      langTools.setLanguage(selectedLanguage);
      window.location.reload();
    });

    return select;
  }
}

const langTools = new LanguageTools();

export default langTools;
