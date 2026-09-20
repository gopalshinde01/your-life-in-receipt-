import React, { ReactNode } from 'react';
import { Header, HeaderProps } from './Header';
import { Footer } from './Footer';
import { SkipLink } from './SkipLink';

export interface AppLayoutProps extends HeaderProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentTheme,
  onSelectTheme,
  currentLanguage,
  onSelectLanguage,
  t,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      <SkipLink />
      <Header
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        currentLanguage={currentLanguage}
        onSelectLanguage={onSelectLanguage}
        t={t}
      />
      {children}
      <Footer />
    </div>
  );
};
