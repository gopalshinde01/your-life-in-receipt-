import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { QuickSummary } from '../components/dashboard/QuickSummary';
import { ScoreOverview } from '../components/dashboard/ScoreOverview';
import { TodayFocus } from '../components/dashboard/TodayFocus';
import { RecentEntries } from '../components/dashboard/RecentEntries';
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
  const { activities, expenses, goals, moods, notes = [], profile, deleteActivity, deleteExpense } = lifeData;

  const [timeScope, setTimeScope] = useState<'today' | 'all'>('today');
  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter datasets based on selected time scope
  const scopedActivities = useMemo(() => {
    return timeScope === 'today' ? activities.filter(a => a.date === todayIso) : activities;
  }, [activities, timeScope, todayIso]);

  const scopedExpenses = useMemo(() => {
    return timeScope === 'today' ? expenses.filter(e => e.date === todayIso) : expenses;
  }, [expenses, timeScope, todayIso]);

  const scopedMoods = useMemo(() => {
    return timeScope === 'today' ? moods.filter(m => m.date === todayIso) : moods;
  }, [moods, timeScope, todayIso]);

  const totalMinutes = useMemo(() => calculateTotalTime(scopedActivities), [scopedActivities]);
  const totalExpenses = useMemo(() => calculateTotalExpenses(scopedExpenses), [scopedExpenses]);
  const activeGoals = useMemo(() => goals.filter(g => !g.completed).length, [goals]);
  const completedGoals = useMemo(() => goals.filter(g => g.completed).length, [goals]);
  const avgMood = useMemo(() => calculateMoodAverage(scopedMoods).average, [scopedMoods]);

  // For life score: if today has entries, evaluate today; else fallback to all-time so score isn't zero on fresh days
  const lifeScoreData = useMemo(() => {
    const act = scopedActivities.length > 0 ? scopedActivities : activities;
    const md = scopedMoods.length > 0 ? scopedMoods : moods;
    return calculateLifeScore({ activities: act, goals, moods: md });
  }, [scopedActivities, activities, scopedMoods, moods, goals]);

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
        {/* Scope Selector Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Summary Period:
            </span>
            <div className="flex items-center p-0.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <button
                type="button"
                onClick={() => setTimeScope('today')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeScope === 'today'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Today ({todayIso})
              </button>
              <button
                type="button"
                onClick={() => setTimeScope('all')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeScope === 'all'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                All-Time Total
              </button>
            </div>
          </div>

          <div className="text-xs text-neutral-400">
            {timeScope === 'today' ? (
              <span>
                Showing logs for today: <strong className="text-amber-400 font-mono">{scopedActivities.length}</strong> acts, <strong className="text-amber-400 font-mono">{scopedExpenses.length}</strong> exps
              </span>
            ) : (
              <span>
                Showing cumulative totals across all historical entries
              </span>
            )}
          </div>
        </div>

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
        <ScoreOverview scoreData={lifeScoreData} t={t} />

        {/* Today's Focus Section */}
        <TodayFocus goals={goals} />

        {/* Unified Recent Entries Stream */}
        <RecentEntries
          activities={activities}
          expenses={expenses}
          moods={moods}
          notes={notes}
          currency={profile.currency}
        />

        {/* Two-Column Detailed Lists: Activities & Expenses */}
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

