import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

export interface FooterProps {
  onOpenFeedback?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFeedback }) => {
  return (
    <footer className="no-print mt-auto border-t border-neutral-800/80 bg-neutral-950/60 text-neutral-400 text-xs py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-200">Your Life In Receipt</span>
          <span>—</span>
          <span>Frontend-Only Private Audit Ledger</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <Link to={ROUTES.HOME} className="hover:text-amber-400 focus:outline-none focus-visible:underline">
            Home
          </Link>
          <Link to={ROUTES.DASHBOARD} className="hover:text-amber-400 focus:outline-none focus-visible:underline">
            Dashboard
          </Link>
          <Link to={ROUTES.RECEIPT} className="hover:text-amber-400 focus:outline-none focus-visible:underline">
            Receipt
          </Link>
          <Link to={ROUTES.ANALYTICS} className="hover:text-amber-400 focus:outline-none focus-visible:underline">
            Analytics
          </Link>
          <Link to={ROUTES.PROFILE} className="hover:text-amber-400 focus:outline-none focus-visible:underline">
            Profile & Settings
          </Link>
          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="text-amber-400 hover:text-amber-300 focus:outline-none focus-visible:underline font-medium cursor-pointer"
            >
              💬 Feedback
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-neutral-500">
          <span>Keyboard Friendly (TAB / ESC)</span>
          <span>•</span>
          <span>100% LocalStorage</span>
        </div>
      </div>
    </footer>
  );
};
