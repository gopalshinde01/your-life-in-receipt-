import React from 'react';
import { Card } from '../common/Card';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  accessibleSummary: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  accessibleSummary,
  children,
}) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-neutral-100">{title}</h3>
        {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Screen Reader Accessible Summary */}
      <div className="sr-only" role="region" aria-label={`Text summary for ${title}`}>
        <p>{accessibleSummary}</p>
      </div>

      {/* Visual Chart Container with fixed minimum dimensions to prevent CLS */}
      <div className="w-full flex-1 min-h-[220px] flex items-center justify-center">
        {children}
      </div>

      {/* Visible accessible text note below chart */}
      <div className="mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-400">
        <span className="font-semibold text-neutral-300">Summary: </span>
        <span>{accessibleSummary}</span>
      </div>
    </Card>
  );
};
