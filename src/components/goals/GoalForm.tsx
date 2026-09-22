import React, { useState } from 'react';
import { Goal } from '../../types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { clampGoalProgress } from '../../utils/validators';

export interface GoalFormProps {
  initialData?: Partial<Goal>;
  submitLabel?: string;
  onSubmit: (data: {
    title: string;
    description?: string;
    category: string;
    targetDate: string;
    progress: number;
    completed: boolean;
  }) => void;
  onCancel?: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({
  initialData,
  submitLabel,
  onSubmit,
  onCancel,
}) => {
  const todayIso = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'Learning');
  const [targetDate, setTargetDate] = useState(initialData?.targetDate || todayIso);
  const [progress, setProgress] = useState<number>(
    initialData?.progress !== undefined ? initialData.progress : 0
  );

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
      description: description.trim() || undefined,
      category: category.trim() || 'General',
      targetDate,
      progress: safeProgress,
      completed: safeProgress >= 100,
    });

    if (!initialData) {
      setTitle('');
      setDescription('');
      setProgress(0);
    }
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="goal-description" className="text-sm font-medium text-neutral-200">
          Goal Description (Optional)
        </label>
        <textarea
          id="goal-description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief explanation of the goal or target milestone..."
          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 text-sm"
        />
      </div>

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
          {submitLabel || (initialData ? 'Update Goal' : 'Save Goal')}
        </Button>
      </div>
    </form>
  );
};
