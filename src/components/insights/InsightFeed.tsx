import React from 'react';
import { MockInsight } from '../../types';
import { InsightCard } from './InsightCard';
import { EmptyState } from '../common/EmptyState';

export interface InsightFeedProps {
  insights: MockInsight[];
}

export const InsightFeed: React.FC<InsightFeedProps> = ({ insights }) => {
  if (insights.length === 0) {
    return (
      <EmptyState
        title="No insights generated yet"
        description="Log your daily activities and expenses to enable the local deterministic pattern recognition engine."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="feed" aria-label="Personal insights feed">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
};
