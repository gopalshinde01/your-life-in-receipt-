import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';
import { AppTheme, Language } from '../types';
import { ThemeLanguageControl } from '../components/common/ThemeLanguageControl';
import { TranslationKey } from '../i18n/translations';

export interface HeaderProps {
  currentTheme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
  currentLanguage?: Language;
  onSelectLanguage?: (lang: Language) => void;
  t?: (key: TranslationKey) => string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme = 'classic',
  onSelectTheme = () => {},
  currentLanguage = 'en',
  onSelectLanguage = () => {},
  t,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getLabel = (key: TranslationKey, fallback: string) => (t ? t(key) : fallback);

  const navLinks = [
    { to: ROUTES.DASHBOARD, label: getLabel('navDashboard', 'Dashboard') },
    { to: ROUTES.RECEIPT, label: getLabel('navReceipt', 'Receipt') },
    { to: ROUTES.ADD, label: getLabel('navAdd', '+ Add Entry') },
    { to: ROUTES.ACTIVITIES, label: getLabel('navActivities', 'Activities') },
    { to: ROUTES.EXPENSES, label: getLabel('navExpenses', 'Expenses') },
    { to: ROUTES.GOALS, label: getLabel('navGoals', 'Goals') },
    { to: ROUTES.ANALYTICS, label: getLabel('navAnalytics', 'Analytics') },
    { to: ROUTES.INSIGHTS, label: getLabel('navInsights', 'Insights') },
    { to: ROUTES.PROFILE, label: getLabel('navProfile', 'Profile') },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="no-print sticky top-0 z-50 w-full glass-nav shadow-md transition-colors relative">
      {/* Subtle hairline gradient border on bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
          aria-label="Your Life In Receipt Home"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-amber-400 transition-colors">
            🧾
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-neutral-100 tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
              Life In Receipt
            </span>
            <span className="text-[10px] text-neutral-400 font-mono leading-none">
              Daily Ledger
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const isAddButton = link.to === ROUTES.ADD;

            if (isAddButton) {
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="ml-2 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 shadow-sm"
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  isActive
                    ? 'text-amber-400 bg-neutral-800/80 font-semibold'
                    : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Merged Theme & Language Control */}
        <div className="hidden lg:flex items-center ml-2">
          <ThemeLanguageControl
            currentTheme={currentTheme}
            onSelectTheme={onSelectTheme}
            currentLanguage={currentLanguage}
            onSelectLanguage={onSelectLanguage}
            variant="compact"
          />
        </div>

        {/* Mobile menu hamburger button & merged control */}
        <div className="lg:hidden flex items-center gap-1.5">
          <ThemeLanguageControl
            currentTheme={currentTheme}
            onSelectTheme={onSelectTheme}
            currentLanguage={currentLanguage}
            onSelectLanguage={onSelectLanguage}
            variant="compact"
          />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with Backdrop Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-200"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <nav
            id="mobile-navigation"
            className="lg:hidden relative z-40 px-4 pt-3 pb-6 border-t border-neutral-800/90 bg-neutral-900/95 backdrop-blur-xl shadow-2xl flex flex-col gap-1.5 animate-in slide-in-from-top-3 duration-200"
            aria-label="Mobile Navigation"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] flex items-center ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                      : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/70'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </header>
  );
};
