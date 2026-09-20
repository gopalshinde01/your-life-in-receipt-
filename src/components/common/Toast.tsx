import React from 'react';
import { ToastNotification } from '../../types';

export interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map(toast => {
        const typeStyles = {
          success: 'bg-emerald-900/90 border-emerald-600 text-emerald-100',
          error: 'bg-red-900/90 border-red-600 text-red-100',
          warning: 'bg-amber-900/90 border-amber-600 text-amber-100',
          info: 'bg-neutral-800/90 border-neutral-600 text-neutral-100',
        }[toast.type];

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start justify-between gap-3 transition-all transform animate-slide-up ${typeStyles}`}
          >
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{toast.title}</span>
              {toast.message && (
                <span className="text-xs opacity-90 mt-0.5">{toast.message}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="text-current opacity-70 hover:opacity-100 p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-current min-h-[32px] min-w-[32px] flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};
