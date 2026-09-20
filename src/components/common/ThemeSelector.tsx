import React, { useState, useRef, useEffect } from 'react';
import { AppTheme, ThemeConfig } from '../../types';
import { THEMES } from '../../constants';

export interface ThemeSelectorProps {
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  variant?: 'compact' | 'grid';
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
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

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const activeConfig = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="radiogroup" aria-label="Receipt Theme Options">
        {THEMES.map((th: ThemeConfig) => {
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
                <div
                  className="w-4 h-4 rounded-full border border-neutral-600 flex-shrink-0"
                  style={{ backgroundColor: th.receiptBg }}
                  aria-hidden="true"
                />
              </div>

              <p className="text-xs text-neutral-400 leading-snug">
                {th.description}
              </p>

              {isSelected && (
                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono font-bold mt-1">
                  <span>✓ Active Theme</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Compact Header Dropdown version
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Current visual theme: ${activeConfig.name}. Click to change theme.`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[44px]"
      >
        <span aria-hidden="true">{activeConfig.icon}</span>
        <span className="hidden sm:inline">{activeConfig.name}</span>
        <svg className="w-3.5 h-3.5 text-neutral-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Select visual theme"
          className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-neutral-700/80 shadow-2xl py-1.5 z-50 animate-fade-in"
        >
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-neutral-400 font-mono border-b border-neutral-800">
            Select Receipt Theme
          </div>

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
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors min-h-[40px] focus:outline-none focus-visible:bg-neutral-800 ${
                  isSelected
                    ? 'bg-amber-500/10 text-amber-400 font-bold'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">{th.icon}</span>
                  <span>{th.name}</span>
                </div>
                <div
                  className="w-3.5 h-3.5 rounded-full border border-neutral-600"
                  style={{ backgroundColor: th.receiptBg }}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
