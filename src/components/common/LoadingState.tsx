import React from 'react';

export interface LoadingStateProps {
  message?: string;
  minHeight?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  minHeight = 'min-h-[220px]',
}) => {
  return (
    <div
      role="status"
      aria-label={message}
      className={`w-full ${minHeight} flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 animate-pulse`}
    >
      <div className="w-8 h-8 rounded-full border-2 border-neutral-700 border-t-amber-500 animate-spin" aria-hidden="true" />
      <span className="text-xs text-neutral-400 font-medium">{message}</span>
      <span className="sr-only">Please wait, content is loading</span>
    </div>
  );
};
