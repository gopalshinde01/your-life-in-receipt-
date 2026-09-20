import React from 'react';

export interface ReceiptSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ReceiptSection: React.FC<ReceiptSectionProps> = ({ title, children }) => {
  return (
    <section className="my-3 text-current">
      <div className="flex items-center gap-2 mb-1.5">
        <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-current font-mono">
          {title}
        </h3>
        <div className="flex-1 border-b border-dashed border-current opacity-40" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </section>
  );
};
