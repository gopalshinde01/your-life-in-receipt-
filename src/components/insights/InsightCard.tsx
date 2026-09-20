import React from 'react';
import { MockInsight } from '../../types';
import { Badge } from '../common/Badge';

export interface InsightCardProps {
  insight: MockInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getBadgeVariant = (category: MockInsight['category']) => {
    switch (category) {
      case 'strength':
        return 'emerald';
      case 'recommendation':
        return 'amber';
      case 'alert':
        return 'red';
      default:
        return 'blue';
    }
  };

  const getIcon = (category: MockInsight['category']) => {
    switch (category) {
      case 'strength':
        return '⚡';
      case 'recommendation':
        return '💡';
      case 'alert':
        return '⚠️';
      default:
        return '📊';
    }
  };

  return (
    <article className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700/80 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={getBadgeVariant(insight.category)}>
            <span aria-hidden="true">{getIcon(insight.category)}</span>
            <span className="capitalize">{insight.category}</span>
          </Badge>
          {insight.impactScore && (
            <span className="text-xs font-mono text-neutral-400">
              Impact: <strong className="text-neutral-200">{insight.impactScore}/100</strong>
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-neutral-100 mb-2">
          {insight.title}
        </h3>

        <p className="text-sm text-neutral-300 leading-relaxed">
          {insight.message}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
        <span>Deterministic Local Engine</span>
        <span>Ready for API Integration</span>
      </div>
    </article>
  );
};
