import React from 'react';
import { StatCard } from '../common/StatCard';
import { formatCurrency, formatMinutesToHoursMinutes } from '../../utils/formatters';
import { TranslationKey } from '../../i18n/translations';

export interface QuickSummaryProps {
  totalMinutes: number;
  totalExpenses: number;
  currency?: string;
  activeGoalsCount: number;
  completedGoalsCount: number;
  averageMood: number | null;
  t?: (key: TranslationKey) => string;
}

export const QuickSummary: React.FC<QuickSummaryProps> = ({
  totalMinutes,
  totalExpenses,
  currency = '₹',
  activeGoalsCount,
  completedGoalsCount,
  averageMood,
  t,
}) => {
  const getLabel = (key: TranslationKey, fallback: string) => (t ? t(key) : fallback);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title={getLabel('timeTracked', 'Time Tracked')}
        value={formatMinutesToHoursMinutes(totalMinutes)}
        subtitle="Today's waking ledger"
        icon={<span className="text-xl">⏱️</span>}
        trend={{ direction: totalMinutes > 240 ? 'up' : 'neutral', label: `${Math.round(totalMinutes / 60)} hrs recorded` }}
      />

      <StatCard
        title={getLabel('moneySpent', 'Money Spent')}
        value={formatCurrency(totalExpenses, currency)}
        subtitle="Daily financial tally"
        icon={<span className="text-xl">💳</span>}
        trend={{ direction: 'neutral', label: 'Local tally' }}
      />

      <StatCard
        title={getLabel('goalsProgress', 'Goals Progress')}
        value={`${completedGoalsCount} Completed`}
        subtitle={`${activeGoalsCount} in progress`}
        icon={<span className="text-xl">🎯</span>}
        trend={{ direction: completedGoalsCount > 0 ? 'up' : 'neutral', label: `${activeGoalsCount + completedGoalsCount} total goals` }}
      />

      <StatCard
        title={getLabel('averageMood', 'Average Mood')}
        value={averageMood !== null ? `${averageMood}/10` : 'Not logged'}
        subtitle="Subjective emotional state"
        icon={<span className="text-xl">😊</span>}
        trend={{ direction: averageMood && averageMood >= 7 ? 'up' : 'neutral', label: 'Daily reflection' }}
      />
    </div>
  );
};
