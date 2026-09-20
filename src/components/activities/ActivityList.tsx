import React from 'react';
import { Activity } from '../../types';
import { ActivityItem } from './ActivityItem';
import { EmptyState } from '../common/EmptyState';

export interface ActivityListProps {
  activities: Activity[];
  onDelete: (id: string) => void;
  onAddClick?: () => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onDelete,
  onAddClick,
}) => {
  if (activities.length === 0) {
    return (
      <EmptyState
        title="No activities recorded yet"
        description="Track how you spend your waking hours: coding, exercise, deep study, or resting."
        actionLabel="+ Add Your First Activity"
        onAction={onAddClick}
      />
    );
  }

  return (
    <div className="space-y-2.5" role="feed" aria-label="Recorded activities list">
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
