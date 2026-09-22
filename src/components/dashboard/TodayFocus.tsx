import React from 'react';
import { Link } from 'react-router-dom';
import { Goal } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ROUTES } from '../../constants';

export interface TodayFocusProps {
  goals: Goal[];
  onUpdateProgress?: (id: string, progress: number) => void;
}

export const TodayFocus: React.FC<TodayFocusProps> = ({ goals, onUpdateProgress: _onUpdateProgress }) => {
  // Focus on top active (incomplete) goals, sorted by least progress or earliest target date
  const activeGoals = goals
    .filter(g => !g.completed)
    .slice(0, 3);

  return (
    <Card variant="elevated" className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center gap-2">
            <span className="text-amber-400">🎯</span>
            <span>Today's Focus</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Key compounding goals and milestones requiring your energy today.
          </p>
        </div>
        <Link to={ROUTES.GOALS}>
          <span className="text-xs text-amber-400 hover:underline font-medium">
            Manage Goals ({goals.length}) →
          </span>
        </Link>
      </div>

      {activeGoals.length === 0 ? (
        <div className="py-8 text-center space-y-3">
          <div className="text-3xl" aria-hidden="true">🎉</div>
          <p className="text-sm text-neutral-300 font-medium">No focus items yet</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            You've completed all active targets or haven't defined goals yet. Set a meaningful milestone to direct your daily focus.
          </p>
          <Link to={ROUTES.GOALS}>
            <Button variant="primary" size="sm">
              + Create Goal
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeGoals.map((goal) => (
            <div
              key={goal.id}
              className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 hover:border-neutral-700/80 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="amber">{goal.category}</Badge>
                  <span className="text-[11px] font-mono text-neutral-400">
                    ⏱ {goal.targetDate}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-100 line-clamp-2">
                  {goal.title}
                </h3>
                {goal.description && (
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                    {goal.description}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-900">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">Progress</span>
                  <span className="font-bold text-amber-400">{goal.progress}%</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden" aria-hidden="true">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, goal.progress))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link to={ROUTES.GOALS} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      🎯 Focus / Update
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
