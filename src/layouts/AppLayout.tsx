import React, { ReactNode, useState } from 'react';
import { Header, HeaderProps } from './Header';
import { Footer } from './Footer';
import { SkipLink } from './SkipLink';
import { FeedbackModal } from '../components/common/FeedbackModal';

export interface AppLayoutProps extends HeaderProps {
  children: ReactNode;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentTheme,
  onSelectTheme,
  currentLanguage,
  onSelectLanguage,
  t,
  onShowToast,
}) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      <SkipLink />
      <Header
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        currentLanguage={currentLanguage}
        onSelectLanguage={onSelectLanguage}
        t={t}
        onOpenFeedback={() => setFeedbackOpen(true)}
      />
      {children}
      <Footer onOpenFeedback={() => setFeedbackOpen(true)} />

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onShowToast={onShowToast}
      />
    </div>
  );
};
