import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { clampGoalProgress } from '../../utils/validators';

export interface GoalFormProps {
  onSubmit: (data: {
    title: string;
    category: string;
    targetDate: string;
    progress: number;
    completed: boolean;
  }) => void;
  onCancel?: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel }) => {
  const todayIso = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Learning');
  const [targetDate, setTargetDate] = useState(todayIso);
  const [progress, setProgress] = useState<number>(0);

  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrors({ title: 'Goal title is required.' });
      return;
    }

    setErrors({});
    const safeProgress = clampGoalProgress(progress);

    onSubmit({
      title: title.trim(),
      category: category.trim() || 'General',
      targetDate,
      progress: safeProgress,
      completed: safeProgress >= 100,
    });

    setTitle('');
    setProgress(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="goal-title"
        label="Goal Title"
        placeholder="e.g. Master TypeScript Generics & Automated Testing"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) setErrors({});
        }}
        error={errors.title}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="goal-category"
          label="Category / Domain"
          placeholder="e.g. Engineering, Health, Finance"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <Input
          id="goal-target-date"
          label="Target Date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm font-medium text-neutral-200">
          <label htmlFor="goal-initial-progress">Initial Progress</label>
          <span className="font-mono text-amber-400 font-bold">{progress}%</span>
        </div>
        <input
          id="goal-initial-progress"
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer h-6"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
        {onCancel && (
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button variant="primary" size="md" type="submit">
          Save Goal
        </Button>
      </div>
    </form>
  );
};
