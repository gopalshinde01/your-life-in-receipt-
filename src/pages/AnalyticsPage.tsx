import React, { useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ChartCard } from '../components/analytics/ChartCard';
import { CategoryBreakdown, CategoryDataPoint } from '../components/analytics/CategoryBreakdown';
import { Card } from '../components/common/Card';
import { useLifeData } from '../hooks/useLifeData';
import { groupTimeByCategory, groupExpensesByCategory, calculateTotalTime, calculateTotalExpenses } from '../utils/calculations';
import { formatCurrency, formatMinutesToHoursMinutes } from '../utils/formatters';

export interface AnalyticsPageProps {
  lifeData: ReturnType<typeof useLifeData>;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ lifeData }) => {
  const { activities, expenses, profile } = lifeData;

  const totalTimeMinutes = useMemo(() => calculateTotalTime(activities), [activities]);
  const totalExpensesAmount = useMemo(() => calculateTotalExpenses(expenses), [expenses]);

  const timeDataPoints: CategoryDataPoint[] = useMemo(() => {
    const grouped = groupTimeByCategory(activities);
    return grouped.map((item) => {
      const pct = totalTimeMinutes > 0 ? Math.round((item.minutes / totalTimeMinutes) * 100) : 0;
      return {
        label: item.category,
        value: item.minutes,
        formattedValue: item.formatted,
        percentage: pct,
      };
    });
  }, [activities, totalTimeMinutes]);

  const expenseDataPoints: CategoryDataPoint[] = useMemo(() => {
    const grouped = groupExpensesByCategory(expenses, profile.currency);
    return grouped.map((item) => {
      const pct = totalExpensesAmount > 0 ? Math.round((item.amount / totalExpensesAmount) * 100) : 0;
      return {
        label: item.category,
        value: item.amount,
        formattedValue: item.formatted,
        percentage: pct,
      };
    });
  }, [expenses, profile.currency, totalExpensesAmount]);

  const timeSummary = useMemo(() => {
    if (timeDataPoints.length === 0) return 'No activity data recorded yet.';
    const top = timeDataPoints[0];
    return `Total tracked time is ${formatMinutesToHoursMinutes(totalTimeMinutes)}. Top category is ${top.label} accounting for ${top.formattedValue} (${top.percentage}% of time).`;
  }, [timeDataPoints, totalTimeMinutes]);

  const expenseSummary = useMemo(() => {
    if (expenseDataPoints.length === 0) return 'No expense data recorded yet.';
    const top = expenseDataPoints[0];
    return `Total spending is ${formatCurrency(totalExpensesAmount, profile.currency)}. Largest category is ${top.label} at ${top.formattedValue} (${top.percentage}% of expenses).`;
  }, [expenseDataPoints, profile.currency, totalExpensesAmount]);

  return (
    <PageContainer
      title="Analytics & Behavioral Breakdown"
      subtitle="Analyze where your waking hours and financial assets are allocated across categories."
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time Distribution Chart Card */}
          <ChartCard
            title="Time Allocation Breakdown"
            subtitle="Percentage distribution of your tracked minutes"
            accessibleSummary={timeSummary}
          >
            <CategoryBreakdown
              items={timeDataPoints}
              emptyMessage="No activities tracked yet. Start recording activities to see time distribution."
            />
          </ChartCard>

          {/* Expense Distribution Chart Card */}
          <ChartCard
            title="Expense Outflow Breakdown"
            subtitle="Percentage distribution of your recorded expenses"
            accessibleSummary={expenseSummary}
          >
            <CategoryBreakdown
              items={expenseDataPoints}
              emptyMessage="No expenses recorded yet. Start logging expenses to see category shares."
            />
          </ChartCard>
        </div>

        {/* Tabular Data View for Screen Readers and Keyboard Navigators */}
        <Card>
          <h2 className="text-base font-bold text-neutral-100 mb-3 flex items-center gap-2">
            <span>📋</span>
            <span>Tabular Accessible Data Ledger</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <caption className="sr-only">Comprehensive time and spending category ledger</caption>
              <thead className="border-b border-neutral-800 text-neutral-400 font-mono text-xs uppercase">
                <tr>
                  <th scope="col" className="py-2.5 px-3">Category</th>
                  <th scope="col" className="py-2.5 px-3">Time Spent</th>
                  <th scope="col" className="py-2.5 px-3">Time %</th>
                  <th scope="col" className="py-2.5 px-3">Money Spent</th>
                  <th scope="col" className="py-2.5 px-3">Money %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {timeDataPoints.map((tp) => {
                  const matchingExp = expenseDataPoints.find(e => e.label === tp.label);
                  return (
                    <tr key={tp.label} className="hover:bg-neutral-800/30">
                      <th scope="row" className="py-2 px-3 font-medium text-neutral-200">{tp.label}</th>
                      <td className="py-2 px-3 text-amber-400">{tp.formattedValue}</td>
                      <td className="py-2 px-3 text-neutral-400">{tp.percentage}%</td>
                      <td className="py-2 px-3 text-emerald-400">{matchingExp ? matchingExp.formattedValue : '—'}</td>
                      <td className="py-2 px-3 text-neutral-400">{matchingExp ? `${matchingExp.percentage}%` : '0%'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
