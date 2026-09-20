import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
}) => {
  return (
    <Card className="flex flex-col justify-between h-full hover:border-neutral-700 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-neutral-400 uppercase tracking-wider">
            {title}
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-100 mt-2 font-mono tracking-tight">
            {value}
          </p>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-neutral-800/80 text-amber-400 border border-neutral-700/50" aria-hidden="true">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          {subtitle && <span className="text-neutral-400">{subtitle}</span>}
          {trend && (
            <span
              className={`flex items-center gap-1 font-medium ${
                trend.direction === 'up'
                  ? 'text-emerald-400'
                  : trend.direction === 'down'
                  ? 'text-amber-400'
                  : 'text-neutral-400'
              }`}
            >
              <span aria-hidden="true">
                {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '•'}
              </span>
              <span>{trend.label}</span>
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
