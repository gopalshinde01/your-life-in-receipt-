import React, { useState, useRef, useEffect } from 'react';
import { AppTheme, Language, ThemeConfig } from '../../types';
import { THEMES } from '../../constants';
import { LANGUAGES } from '../../i18n/translations';

export interface ThemeLanguageControlProps {
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  variant?: 'compact' | 'expanded';
}

export const ThemeLanguageControl: React.FC<ThemeLanguageControlProps> = ({
  currentTheme,
  onSelectTheme,
  currentLanguage,
  onSelectLanguage,
  variant = 'compact',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const activeThemeConfig: ThemeConfig = THEMES.find(t => t.id === currentTheme) || THEMES[0];
  const activeLangConfig = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  if (variant === 'expanded') {
    return (
      <div className="space-y-6 w-full" aria-label="Theme and Language Controls">
        {/* Step 1: Sequential Theme Selector (2 Options) */}
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2.5">
            1. Theme Selection / रंगसंगती
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Theme Options">
            {THEMES.map((th) => {
              const isSelected = th.id === currentTheme;
              return (
                <button
                  key={th.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelectTheme(th.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[90px] ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-500'
                      : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden="true">{th.icon}</span>
                      <span className="font-semibold text-sm text-neutral-100">{th.name}</span>
                    </div>
                    {isSelected && (
                      <span className="text-amber-400 text-xs font-bold font-mono">✓ Active</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400">{th.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Sequential Language Selector */}
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2.5">
            2. Language Selection / भाषा
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Language Options">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelectLanguage(lang.code)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-sm ring-1 ring-amber-500'
                      : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl" aria-hidden="true">{lang.flag}</span>
                    <div>
                      <span className="font-bold text-sm block text-neutral-100">{lang.nativeName}</span>
                      <span className="text-[11px] text-neutral-400">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-amber-400 text-xs font-bold" aria-hidden="true">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Compact Combined Trigger (Header & Toolbars)
  return (
    <div className="relative inline-flex items-center gap-1.5" ref={dropdownRef}>
      {/* Sleek Dark/Light Segmented Toggle Switch */}
      <div 
        className="flex items-center p-0.5 rounded-xl bg-neutral-800/90 border border-neutral-700/80 shadow-inner"
        role="group"
        aria-label="Theme mode switch"
      >
        <button
          type="button"
          onClick={() => onSelectTheme('classic')}
          aria-pressed={currentTheme === 'classic'}
          aria-label="Switch to Classic Thermal dark theme"
          title="Classic Thermal (Dark)"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[36px] ${
            currentTheme === 'classic'
              ? 'bg-neutral-900 text-amber-400 font-bold shadow-sm border border-neutral-700/60'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span aria-hidden="true">🧾</span>
          <span className="hidden md:inline font-mono text-[11px]">Dark</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTheme('pure-white')}
          aria-pressed={currentTheme === 'pure-white'}
          aria-label="Switch to Pure White light theme"
          title="Pure White (Light)"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[36px] ${
            currentTheme === 'pure-white'
              ? 'bg-white text-neutral-900 font-bold shadow-sm border border-neutral-200'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span aria-hidden="true">☀️</span>
          <span className="hidden md:inline font-mono text-[11px]">Light</span>
        </button>
      </div>

      {/* Combined Preferences Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Display & Language settings. Current: ${activeThemeConfig.name}, ${activeLangConfig.name}`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 border border-neutral-700/80 text-neutral-200 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[40px] shadow-sm"
      >
        <span aria-hidden="true">{activeLangConfig.flag}</span>
        <span className="font-semibold">{activeLangConfig.code.toUpperCase()}</span>
        <svg
          className={`w-3.5 h-3.5 text-neutral-400 ml-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Unified Popover Menu */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
          aria-label="Display & Language Menu"
        >
          {/* Header Title */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-xs font-semibold text-neutral-300">
            <span className="flex items-center gap-1.5">
              <span>⚙️</span>
              <span>Preferences</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Merged Settings</span>
          </div>

          {/* Section 1: Themes (2 Options) */}
          <div className="mb-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 px-1 flex items-center justify-between">
              <span>Theme / रंगसंगती</span>
              <span className="text-[9px] text-amber-400">2 Options</span>
            </div>
            <div className="space-y-1" role="radiogroup" aria-label="Theme options">
              {THEMES.map((th) => {
                const isSelected = th.id === currentTheme;
                return (
                  <button
                    key={th.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onClick={() => {
                      onSelectTheme(th.id);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base" aria-hidden="true">{th.icon}</span>
                      <div>
                        <span className="font-semibold block">{th.name}</span>
                        <span className="text-[10px] text-neutral-400 opacity-90">
                          {th.id === 'classic' ? 'Warm Dark Receipt' : 'Crisp Light Mode'}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-amber-400 font-bold text-xs" aria-hidden="true">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Languages */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 px-1 flex items-center justify-between">
              <span>Language / भाषा</span>
              <span className="text-[9px] text-neutral-500">Regional</span>
            </div>
            <div className="space-y-1" role="radiogroup" aria-label="Language options">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base" aria-hidden="true">{lang.flag}</span>
                      <div>
                        <span className="font-semibold block">{lang.nativeName}</span>
                        <span className="text-[10px] text-neutral-400 opacity-90">{lang.name}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-amber-400 font-bold text-xs" aria-hidden="true">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
