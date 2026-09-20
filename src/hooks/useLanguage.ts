import { useState, useEffect, useCallback } from 'react';
import { Language } from '../types';
import { STORAGE_KEYS } from '../constants';
import { storageService } from '../services/storageService';
import { LANGUAGES, getTranslation, TranslationKey } from '../i18n/translations';

const VALID_LANGUAGES: Language[] = ['en', 'hi', 'mr'];

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = storageService.getItem<string>(STORAGE_KEYS.LANGUAGE, 'en');
    if (VALID_LANGUAGES.includes(saved as Language)) {
      return saved as Language;
    }
    return 'en';
  });

  const setLanguage = useCallback((newLang: Language) => {
    if (VALID_LANGUAGES.includes(newLang)) {
      setLanguageState(newLang);
      storageService.setItem(STORAGE_KEYS.LANGUAGE, newLang);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback(
    (key: TranslationKey): string => {
      return getTranslation(language, key);
    },
    [language]
  );

  return {
    language,
    setLanguage,
    t,
    availableLanguages: LANGUAGES,
  };
}
