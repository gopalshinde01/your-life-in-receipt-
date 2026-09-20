import React from 'react';
import { Goal } from '../../types';
import { GoalCard } from './GoalCard';
import { EmptyState } from '../common/EmptyState';

export interface GoalListProps {
  goals: Goal[];
  onUpdateProgress: (id: string, progress: number) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onAddClick?: () => void;
}

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  onUpdateProgress,
  onToggleComplete,
  onDelete,
  onAddClick,
}) => {
  if (goals.length === 0) {
    return (
      <EmptyState
        title="No personal goals set yet"
        description="Set measurable milestones to turn day-to-day effort into long-term compounding growth."
        actionLabel="+ Add Your First Goal"
        onAction={onAddClick}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="feed" aria-label="Goals list">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onUpdateProgress={onUpdateProgress}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
