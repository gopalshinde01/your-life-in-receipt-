import React from 'react';
import { Activity } from '../../types';
import { formatMinutesToHoursMinutes } from '../../utils/formatters';
import { Badge } from '../common/Badge';

export interface ActivityItemProps {
  activity: Activity;
  onDelete: (id: string) => void;
  onEdit?: (activity: Activity) => void;
}

const ActivityItemComponent: React.FC<ActivityItemProps> = ({ activity, onDelete, onEdit }) => {
  const getBadgeVariant = (category: string): 'amber' | 'emerald' | 'blue' | 'purple' | 'neutral' => {
    switch (category) {
      case 'Coding':
      case 'Work':
        return 'amber';
      case 'Study':
      case 'Reading':
        return 'blue';
      case 'Exercise':
        return 'emerald';
      case 'Social Media':
      case 'Entertainment':
        return 'purple';
      default:
        return 'neutral';
    }
  };

  return (
    <article className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700/80 transition-colors flex items-center justify-between gap-4">
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant={getBadgeVariant(activity.category)}>
            {activity.category}
          </Badge>
          <span className="text-xs text-neutral-400 font-mono">
            {activity.date}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-neutral-100 truncate">
          {activity.title}
        </h4>
        {activity.notes && (
          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
            {activity.notes}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <span className="text-sm sm:text-base font-bold font-mono text-amber-400 mr-1">
          {formatMinutesToHoursMinutes(activity.durationMinutes)}
        </span>
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(activity)}
            aria-label={`Edit activity ${activity.title}`}
            className="text-neutral-400 hover:text-amber-400 p-2 rounded-lg hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(activity.id)}
          aria-label={`Delete activity ${activity.title}`}
          className="text-neutral-500 hover:text-red-400 p-2 rounded-lg hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </article>
  );
};

export const ActivityItem = React.memo(ActivityItemComponent);
