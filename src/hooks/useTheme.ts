import { useState, useEffect, useCallback } from 'react';
import { AppTheme, ThemeConfig } from '../types';
import { STORAGE_KEYS, THEMES } from '../constants';
import { storageService } from '../services/storageService';

const VALID_THEMES: AppTheme[] = ['classic', 'pure-white'];

export function useTheme() {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = storageService.getItem<string>(STORAGE_KEYS.THEME, 'classic');
    if (VALID_THEMES.includes(saved as AppTheme)) {
      return saved as AppTheme;
    }
    return 'classic';
  });

  const setTheme = useCallback((newTheme: AppTheme) => {
    if (VALID_THEMES.includes(newTheme)) {
      setThemeState(newTheme);
      storageService.setItem(STORAGE_KEYS.THEME, newTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const currentConfig: ThemeConfig = THEMES.find(t => t.id === theme) || THEMES[0];

  return {
    theme,
    setTheme,
    currentConfig,
    availableThemes: THEMES,
  };
}
