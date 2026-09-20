import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/40">
      {icon ? (
        <div className="w-14 h-14 rounded-2xl bg-neutral-800/80 border border-neutral-700/50 flex items-center justify-center text-neutral-400 mb-4" aria-hidden="true">
          {icon}
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 mb-4" aria-hidden="true">
          🧾
        </div>
      )}
      <h3 className="text-base sm:text-lg font-semibold text-neutral-200">{title}</h3>
      <p className="text-sm text-neutral-400 max-w-sm mt-1.5 mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
