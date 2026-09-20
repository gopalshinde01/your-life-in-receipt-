import React from 'react';
import { Goal } from '../../types';
import { Badge } from '../common/Badge';

export interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (id: string, progress: number) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onUpdateProgress,
  onToggleComplete,
  onDelete,
}) => {
  return (
    <article className={`p-5 rounded-2xl border transition-all ${
      goal.completed 
        ? 'bg-neutral-900/40 border-emerald-900/40' 
        : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={goal.completed ? 'emerald' : 'blue'}>
            {goal.category}
          </Badge>
          {goal.completed && (
            <Badge variant="emerald">
              ✓ Completed
            </Badge>
          )}
          <span className="text-xs text-neutral-400 font-mono">
            Target: {goal.targetDate}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleComplete(goal.id)}
            aria-label={goal.completed ? `Mark ${goal.title} as incomplete` : `Mark ${goal.title} as completed`}
            className={`p-1.5 rounded-lg border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              goal.completed
                ? 'border-emerald-600 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60'
                : 'border-neutral-700 hover:border-neutral-600 text-neutral-400 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="font-bold text-sm">
              {goal.completed ? '✓' : '○'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(goal.id)}
            aria-label={`Delete goal ${goal.title}`}
            className="text-neutral-500 hover:text-red-400 p-2 rounded-lg hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <h4 className={`text-base font-semibold mb-3 ${goal.completed ? 'line-through text-neutral-400' : 'text-neutral-100'}`}>
        {goal.title}
      </h4>

      {/* Progress Bar & Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <label htmlFor={`goal-progress-${goal.id}`} className="text-neutral-400">
            Progress
          </label>
          <span className="font-bold text-neutral-200">{goal.progress}%</span>
        </div>

        <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden" aria-hidden="true">
          <div
            className={`h-full transition-all duration-300 ${
              goal.completed ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, goal.progress))}%` }}
          />
        </div>

        <input
          id={`goal-progress-${goal.id}`}
          type="range"
          min="0"
          max="100"
          value={goal.progress}
          disabled={goal.completed}
          onChange={(e) => onUpdateProgress(goal.id, Number(e.target.value))}
          aria-label={`Progress percentage for goal: ${goal.title}`}
          className="w-full accent-amber-500 cursor-pointer h-6"
        />
      </div>
    </article>
  );
};
