import React, { useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { InsightFeed } from '../components/insights/InsightFeed';
import { Card } from '../components/common/Card';
import { useLifeData } from '../hooks/useLifeData';
import { insightService } from '../services/insightService';

export interface InsightsPageProps {
  lifeData: ReturnType<typeof useLifeData>;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ lifeData }) => {
  const { activities, expenses, goals, moods, profile } = lifeData;

  const insights = useMemo(() => {
    return insightService.generateComprehensiveInsights({
      activities,
      expenses,
      goals,
      moods,
      currency: profile.currency,
    });
  }, [activities, expenses, goals, moods, profile.currency]);

  return (
    <PageContainer
      title="AI Reflections & Insights"
      subtitle="Deterministic, privacy-first behavioral analysis extracted from your daily habit records."
    >
      <div className="space-y-6">
        {/* System Architecture Callout */}
        <Card className="bg-amber-950/20 border-amber-800/40">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0" aria-hidden="true">💡</span>
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <strong className="font-semibold text-amber-300">Local Deterministic Engine: </strong>
              All reflections below are generated entirely on your browser using deterministic heuristic rules analyzing your actual input metrics.
              Zero prompts or personal information are ever dispatched to external cloud AI APIs.
            </div>
          </div>
        </Card>

        {/* Insights Feed */}
        <InsightFeed insights={insights} />
      </div>
    </PageContainer>
  );
};
