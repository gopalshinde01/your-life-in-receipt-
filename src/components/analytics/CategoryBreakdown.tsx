import React from 'react';

export interface CategoryDataPoint {
  label: string;
  value: number;
  formattedValue: string;
  percentage: number;
  colorClass?: string;
}

export interface CategoryBreakdownProps {
  items: CategoryDataPoint[];
  emptyMessage?: string;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  items,
  emptyMessage = 'No data available for breakdown.',
}) => {
  if (items.length === 0) {
    return (
      <div className="w-full py-8 text-center text-xs text-neutral-400">
        {emptyMessage}
      </div>
    );
  }

  const defaultColors = [
    'bg-amber-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-orange-500',
    'bg-neutral-500',
  ];

  return (
    <div className="w-full space-y-3" role="list" aria-label="Category percentage breakdown">
      {items.map((item, idx) => {
        const color = item.colorClass || defaultColors[idx % defaultColors.length];

        return (
          <div key={item.label} className="space-y-1" role="listitem">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-medium text-neutral-200">{item.label}</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-neutral-400">{item.formattedValue}</span>
                <span className="font-semibold text-neutral-200 w-10 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>

            {/* Accessible Progress Track */}
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden" aria-hidden="true">
              <div
                className={`h-full ${color} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(2, item.percentage))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
