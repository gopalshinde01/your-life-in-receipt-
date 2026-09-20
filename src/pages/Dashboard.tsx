import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { QuickSummary } from '../components/dashboard/QuickSummary';
import { ScoreOverview } from '../components/dashboard/ScoreOverview';
import { ActivityList } from '../components/activities/ActivityList';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { Button } from '../components/common/Button';
import { ROUTES } from '../constants';
import { useLifeData } from '../hooks/useLifeData';
import { calculateTotalTime, calculateTotalExpenses, calculateLifeScore, calculateMoodAverage } from '../utils/calculations';

import { TranslationKey } from '../i18n/translations';

export interface DashboardProps {
  lifeData: ReturnType<typeof useLifeData>;
  t?: (key: TranslationKey) => string;
}

export const DashboardPage: React.FC<DashboardProps> = ({ lifeData, t }) => {
  const { activities, expenses, goals, moods, profile, deleteActivity, deleteExpense } = lifeData;

  const totalMinutes = useMemo(() => calculateTotalTime(activities), [activities]);
  const totalExpenses = useMemo(() => calculateTotalExpenses(expenses), [expenses]);
  const activeGoals = useMemo(() => goals.filter(g => !g.completed).length, [goals]);
  const completedGoals = useMemo(() => goals.filter(g => g.completed).length, [goals]);
  const avgMood = useMemo(() => calculateMoodAverage(moods).average, [moods]);

  const lifeScore = useMemo(() => calculateLifeScore({ activities, goals, moods }), [activities, goals, moods]);

  const getLabel = (key: TranslationKey, fallback: string) => (t ? t(key) : fallback);

  return (
    <PageContainer
      title={`${getLabel('welcomeBack', 'Welcome back')}, ${profile.name}`}
      subtitle={getLabel('dashboardSubtitle', 'Here is your living ledger for today. Every transaction, moment, and achievement is captured below.')}
      action={
        <div className="flex items-center gap-2">
          <Link to={ROUTES.RECEIPT}>
            <Button variant="outline" size="sm">
              {getLabel('navReceipt', '🧾 View Receipt')}
            </Button>
          </Link>
          <Link to={ROUTES.ADD}>
            <Button variant="primary" size="sm">
              {getLabel('navAdd', '+ Add Entry')}
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Quick KPI Stat Cards */}
        <QuickSummary
          totalMinutes={totalMinutes}
          totalExpenses={totalExpenses}
          currency={profile.currency}
          activeGoalsCount={activeGoals}
          completedGoalsCount={completedGoals}
          averageMood={avgMood}
          t={t}
        />

        {/* Life Score Calculation Overview */}
        <ScoreOverview scoreData={lifeScore} t={t} />

        {/* Two-Column Grid: Recent Activities & Recent Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Recent Activities */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                <span>⏱️</span>
                <span>{getLabel('recentActivities', 'Recent Activities')}</span>
              </h2>
              <Link to={ROUTES.ACTIVITIES} className="text-xs text-amber-400 hover:underline font-medium">
                {getLabel('viewAll', 'View All')} ({activities.length}) →
              </Link>
            </div>

            <ActivityList
              activities={activities.slice(0, 4)}
              onDelete={deleteActivity}
            />
          </section>

          {/* Right: Recent Expenses */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                <span>💳</span>
                <span>{getLabel('recentExpenses', 'Recent Expenses')}</span>
              </h2>
              <Link to={ROUTES.EXPENSES} className="text-xs text-amber-400 hover:underline font-medium">
                {getLabel('viewAll', 'View All')} ({expenses.length}) →
              </Link>
            </div>

            <ExpenseList
              expenses={expenses.slice(0, 4)}
              currency={profile.currency}
              onDelete={deleteExpense}
            />
          </section>
        </div>
      </div>
    </PageContainer>
  );
};
