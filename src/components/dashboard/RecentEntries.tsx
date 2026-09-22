import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Expense, MoodEntry, NoteEntry } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatCurrency, formatMinutesToHoursMinutes } from '../../utils/formatters';
import { ROUTES } from '../../constants';

export interface RecentEntriesProps {
  activities: Activity[];
  expenses: Expense[];
  moods: MoodEntry[];
  notes?: NoteEntry[];
  currency?: string;
}

interface UnifiedEntry {
  id: string;
  type: 'activity' | 'expense' | 'mood' | 'note';
  icon: string;
  title: string;
  subtitle?: string;
  category: string;
  value: string;
  date: string;
  timestamp: number;
}

export const RecentEntries: React.FC<RecentEntriesProps> = ({
  activities,
  expenses,
  moods,
  notes = [],
  currency = '₹',
}) => {
  const getActivityIcon = (category: string) => {
    switch (category) {
      case 'Coding': return '💻';
      case 'Study': return '📚';
      case 'Work': return '💼';
      case 'Exercise': return '🏃';
      case 'Reading': return '📖';
      case 'Entertainment': return '🎬';
      case 'Social Media': return '📱';
      default: return '⏱️';
    }
  };

  const getExpenseIcon = (category: string) => {
    switch (category) {
      case 'Food': return '🍕';
      case 'Travel': return '🚕';
      case 'Shopping': return '🛍️';
      case 'Utilities': return '⚡';
      case 'Health': return '🩺';
      case 'Education': return '🎓';
      default: return '💳';
    }
  };

  // Unify and sort entries
  const unifiedEntries: UnifiedEntry[] = [
    ...activities.map((a): UnifiedEntry => ({
      id: `act_${a.id}`,
      type: 'activity',
      icon: getActivityIcon(a.category),
      title: a.title,
      subtitle: a.notes,
      category: a.category,
      value: formatMinutesToHoursMinutes(a.durationMinutes),
      date: a.date,
      timestamp: a.createdAt || (a.date ? new Date(a.date).getTime() : 0),
    })),
    ...expenses.map((e): UnifiedEntry => ({
      id: `exp_${e.id}`,
      type: 'expense',
      icon: getExpenseIcon(e.category),
      title: e.description,
      category: e.category,
      value: formatCurrency(e.amount, currency),
      date: e.date,
      timestamp: e.createdAt || (e.date ? new Date(e.date).getTime() : 0),
    })),
    ...moods.map((m): UnifiedEntry => ({
      id: `mood_${m.id}`,
      type: 'mood',
      icon: m.rating >= 8 ? '😊' : m.rating >= 5 ? '😐' : '😔',
      title: 'Daily Reflection / Mood',
      subtitle: m.note,
      category: 'Emotional Vibe',
      value: `Mood ${m.rating}/10`,
      date: m.date,
      timestamp: m.createdAt || (m.date ? new Date(m.date).getTime() : 0),
    })),
    ...notes.map((n): UnifiedEntry => ({
      id: `note_${n.id}`,
      type: 'note',
      icon: '📝',
      title: n.title,
      subtitle: n.description,
      category: 'Journal Note',
      value: 'Note',
      date: n.date,
      timestamp: n.createdAt || (n.date ? new Date(n.date).getTime() : 0),
    })),
  ]
    .sort((a, b) => {
      if (b.date !== a.date) {
        return b.date.localeCompare(a.date);
      }
      return b.timestamp - a.timestamp;
    })
    .slice(0, 6);

  return (
    <Card variant="default" className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">📋</span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-100">
              Recent Entries
            </h2>
            <p className="text-xs text-neutral-400">
              Latest items recorded across your habits, finances, and journal.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to={ROUTES.ACTIVITIES} className="text-xs text-amber-400 hover:underline font-medium">
            View all activities →
          </Link>
          <Link to={ROUTES.EXPENSES} className="text-xs text-emerald-400 hover:underline font-medium hidden sm:inline">
            Expenses →
          </Link>
        </div>
      </div>

      {unifiedEntries.length === 0 ? (
        <div className="py-8 text-center space-y-3">
          <div className="text-3xl" aria-hidden="true">📭</div>
          <p className="text-sm text-neutral-300 font-medium">No recent entries recorded yet</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Your ledger is currently empty. Record an activity, expense, or mood reflection to populate your daily docket.
          </p>
          <Link to={ROUTES.ADD}>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shadow">
              + Add First Entry
            </span>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-neutral-800/60" role="feed" aria-label="Recent entries stream">
          {unifiedEntries.map((item) => (
            <article
              key={item.id}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 hover:bg-neutral-800/20 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl flex-shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-neutral-100 truncate">
                      {item.title}
                    </h3>
                    <Badge
                      variant={
                        item.type === 'activity'
                          ? 'blue'
                          : item.type === 'expense'
                          ? 'emerald'
                          : item.type === 'mood'
                          ? 'purple'
                          : 'amber'
                      }
                    >
                      {item.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                    <span className="font-mono">{item.date}</span>
                    {item.subtitle && (
                      <span className="truncate max-w-[200px] sm:max-w-xs text-neutral-400">
                        · {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <span
                  className={`text-xs sm:text-sm font-mono font-bold ${
                    item.type === 'expense'
                      ? 'text-emerald-400'
                      : item.type === 'activity'
                      ? 'text-amber-400'
                      : 'text-neutral-200'
                  }`}
                >
                  {item.value}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </Card>
  );
};
