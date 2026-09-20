import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../../types';
import { LANGUAGES } from '../../i18n/translations';

export interface LanguageSelectorProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const activeOption = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Current language: ${activeOption.nativeName}. Click to change language.`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[44px]"
      >
        <span aria-hidden="true">{activeOption.flag}</span>
        <span className="font-semibold">{activeOption.nativeName}</span>
        <svg className="w-3.5 h-3.5 text-neutral-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Select application language"
          className="absolute right-0 mt-2 w-48 rounded-xl bg-neutral-900 border border-neutral-700/80 shadow-2xl py-1.5 z-50 animate-fade-in"
        >
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-neutral-400 font-mono border-b border-neutral-800">
            Language / भाषा
          </div>

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
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors min-h-[40px] focus:outline-none focus-visible:bg-neutral-800 ${
                  isSelected
                    ? 'bg-amber-500/10 text-amber-400 font-bold'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">{lang.flag}</span>
                  <div>
                    <div className="font-medium text-neutral-100">{lang.nativeName}</div>
                    <div className="text-[10px] text-neutral-400">{lang.name}</div>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-amber-400 font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
