import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Expense, Goal, MoodEntry } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ROUTES } from '../../constants';
import { formatCurrency, formatMinutesToHoursMinutes } from '../../utils/formatters';

export interface WeeklyTrendChartsProps {
  activities: Activity[];
  expenses: Expense[];
  goals: Goal[];
  moods: MoodEntry[];
  currency?: string;
}

const PRODUCTIVE_CATEGORIES = ['Study', 'Coding', 'Work', 'Exercise', 'Reading'];

interface DayData {
  date: string;
  dayName: string;
  shortDate: string;
  productivityMins: number;
  spending: number;
  mood: number | null;
  timeTrackedMins: number;
  goalsCompleted: number;
}

export const WeeklyTrendCharts: React.FC<WeeklyTrendChartsProps> = ({
  activities,
  expenses,
  goals,
  moods,
  currency = '₹',
}) => {
  // Generate sequence for the last 7 calendar days
  const days: DayData[] = useMemo(() => {
    const result: DayData[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateIso = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
      const shortDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      // Daily filters
      const dayActivities = activities.filter(a => a.date === dateIso);
      const dayExpenses = expenses.filter(e => e.date === dateIso);
      const dayMoods = moods.filter(m => m.date === dateIso);
      const dayGoals = goals.filter(g => g.completed && (g.targetDate === dateIso || (g as any).completedAt?.startsWith(dateIso)));

      const productivityMins = dayActivities
        .filter(a => PRODUCTIVE_CATEGORIES.includes(a.category))
        .reduce((sum, a) => sum + a.durationMinutes, 0);

      const timeTrackedMins = dayActivities.reduce((sum, a) => sum + a.durationMinutes, 0);
      const spending = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

      const mood = dayMoods.length > 0
        ? Math.round((dayMoods.reduce((sum, m) => sum + m.rating, 0) / dayMoods.length) * 10) / 10
        : null;

      result.push({
        date: dateIso,
        dayName,
        shortDate,
        productivityMins,
        spending,
        mood,
        timeTrackedMins,
        goalsCompleted: dayGoals.length,
      });
    }
    return result;
  }, [activities, expenses, goals, moods]);

  // Aggregate checks
  const totalProductivity = useMemo(() => days.reduce((s, d) => s + d.productivityMins, 0), [days]);
  const totalSpending = useMemo(() => days.reduce((s, d) => s + d.spending, 0), [days]);
  const totalTimeTracked = useMemo(() => days.reduce((s, d) => s + d.timeTrackedMins, 0), [days]);
  const totalGoalsCompleted = useMemo(() => days.reduce((s, d) => s + d.goalsCompleted, 0), [days]);
  const hasAnyMood = useMemo(() => days.some(d => d.mood !== null), [days]);

  // SVG Bar Chart Render Helper
  const renderBarChart = (
    data: { label: string; value: number; displayVal: string }[],
    accentColor: string,
    emptyMessage: string
  ) => {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    const hasData = data.some(d => d.value > 0);

    if (!hasData) {
      return (
        <div className="py-12 px-4 text-center space-y-3 bg-neutral-950/40 rounded-xl border border-neutral-800/80">
          <span className="text-3xl block" aria-hidden="true">📊</span>
          <p className="text-sm font-semibold text-neutral-300">{emptyMessage}</p>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            Add your first entry to see your 7-day performance trend.
          </p>
          <Link to={ROUTES.ADD}>
            <Button variant="outline" size="sm">
              + Add Entry
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="w-full space-y-2 pt-2">
        <div className="flex items-end justify-between gap-2 h-36 px-2">
          {data.map((item, idx) => {
            const heightPercent = Math.max(4, Math.round((item.value / maxVal) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Value Hover Tooltip */}
                <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">
                  {item.displayVal}
                </span>
                {/* Bar */}
                <div
                  className="w-full max-w-[28px] rounded-t-md transition-all duration-300 group-hover:brightness-125"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: accentColor,
                  }}
                  role="img"
                  aria-label={`${item.label}: ${item.displayVal}`}
                />
              </div>
            );
          })}
        </div>
        {/* X Axis Labels */}
        <div className="flex justify-between gap-2 border-t border-neutral-800 pt-2 px-2 text-center">
          {data.map((item, idx) => (
            <div key={idx} className="flex-1 text-[11px] font-mono text-neutral-400">
              {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // SVG Line / Dot Chart for Mood (1 - 10)
  const renderMoodChart = () => {
    if (!hasAnyMood) {
      return (
        <div className="py-12 px-4 text-center space-y-3 bg-neutral-950/40 rounded-xl border border-neutral-800/80">
          <span className="text-3xl block" aria-hidden="true">😊</span>
          <p className="text-sm font-semibold text-neutral-300">No mood records this week.</p>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            Log your daily reflection to unlock your subjective emotional trendline.
          </p>
          <Link to={ROUTES.ADD}>
            <Button variant="outline" size="sm">
              Log Today's Mood
            </Button>
          </Link>
        </div>
      );
    }

    const svgWidth = 320;
    const svgHeight = 120;
    const paddingX = 25;
    const paddingY = 20;

    const points = days.map((d, idx) => {
      const x = paddingX + (idx / (days.length - 1)) * (svgWidth - paddingX * 2);
      const moodVal = d.mood ?? 5;
      const y = svgHeight - paddingY - ((moodVal - 1) / 9) * (svgHeight - paddingY * 2);
      return { x, y, mood: d.mood, label: d.dayName };
    });

    const pathD = points.reduce((acc, pt, idx) => {
      return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`;
    }, '');

    return (
      <div className="w-full space-y-2 pt-2">
        <div className="w-full overflow-hidden flex justify-center">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-36 overflow-visible"
            aria-label="7-day mood rating trend line from 1 to 10"
          >
            {/* Horizontal Grid lines */}
            <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#262626" strokeDasharray="3 3" />
            <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="#262626" strokeDasharray="3 3" />
            <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#262626" strokeDasharray="3 3" />

            {/* Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={pt.mood !== null ? 5 : 3}
                  fill={pt.mood !== null ? '#8b5cf6' : '#525252'}
                  stroke="#171717"
                  strokeWidth="2"
                />
                {pt.mood !== null && (
                  <text
                    x={pt.x}
                    y={pt.y - 9}
                    textAnchor="middle"
                    fill="#c4b5fd"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {pt.mood}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>
        {/* X Axis Labels */}
        <div className="flex justify-between gap-2 border-t border-neutral-800 pt-2 px-2 text-center">
          {days.map((d, idx) => (
            <div key={idx} className="flex-1 text-[11px] font-mono text-neutral-400">
              {d.dayName}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-800 pb-2">
        <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
          <span>📈</span>
          <span>Weekly 7-Day Performance Trends</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Real telemetry comparing your daily commitments, spending patterns, and subjective well-being.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Productivity Over Last 7 Days */}
        <Card variant="elevated">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-2">
            <div>
              <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                <span className="text-amber-400">⚡</span>
                <span>Productivity (7 Days)</span>
              </h3>
              <p className="text-xs text-neutral-400">Study, Coding, Work, Exercise, Reading</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">
              {formatMinutesToHoursMinutes(totalProductivity)}
            </span>
          </div>

          {renderBarChart(
            days.map(d => ({
              label: d.dayName,
              value: d.productivityMins,
              displayVal: `${Math.round(d.productivityMins / 60)}h`,
            })),
            '#f59e0b',
            'No productivity data recorded yet.'
          )}
        </Card>

        {/* 2. Spending Over Last 7 Days */}
        <Card variant="elevated">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-2">
            <div>
              <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                <span className="text-emerald-400">💳</span>
                <span>Spending (7 Days)</span>
              </h3>
              <p className="text-xs text-neutral-400">Outflows and daily expenses</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {formatCurrency(totalSpending, currency)}
            </span>
          </div>

          {renderBarChart(
            days.map(d => ({
              label: d.dayName,
              value: d.spending,
              displayVal: formatCurrency(d.spending, currency),
            })),
            '#10b981',
            'No expenses recorded yet.'
          )}
        </Card>

        {/* 3. Time Tracked Over Last 7 Days */}
        <Card variant="elevated">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-2">
            <div>
              <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                <span className="text-amber-500">⏱️</span>
                <span>Time Tracked (7 Days)</span>
              </h3>
              <p className="text-xs text-neutral-400">Total waking hours accounted for</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-500">
              {formatMinutesToHoursMinutes(totalTimeTracked)}
            </span>
          </div>

          {renderBarChart(
            days.map(d => ({
              label: d.dayName,
              value: d.timeTrackedMins,
              displayVal: formatMinutesToHoursMinutes(d.timeTrackedMins),
            })),
            '#d97706',
            'No activity data yet.'
          )}
        </Card>

        {/* 4. Mood Over Last 7 Days */}
        <Card variant="elevated">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-2">
            <div>
              <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                <span className="text-purple-400">😊</span>
                <span>Mood & Reflection (7 Days)</span>
              </h3>
              <p className="text-xs text-neutral-400">Emotional state rated 1 to 10</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400">
              Scale 1-10
            </span>
          </div>

          {renderMoodChart()}
        </Card>

        {/* 5. Goals Completed Over Last 7 Days */}
        <Card variant="elevated" className="md:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-2">
            <div>
              <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                <span className="text-cyan-400">🎯</span>
                <span>Goals Completed (7 Days)</span>
              </h3>
              <p className="text-xs text-neutral-400">Milestones achieved this week</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {totalGoalsCompleted} Completed
            </span>
          </div>

          {renderBarChart(
            days.map(d => ({
              label: d.dayName,
              value: d.goalsCompleted,
              displayVal: `${d.goalsCompleted} done`,
            })),
            '#06b6d4',
            'No goals completed this week.'
          )}
        </Card>
      </div>
    </div>
  );
};
