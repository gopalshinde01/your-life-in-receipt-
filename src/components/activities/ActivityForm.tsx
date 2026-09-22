import React, { useState } from 'react';
import { Activity, ActivityCategory } from '../../types';
import { ACTIVITY_CATEGORIES } from '../../constants';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { validateDurationMinutes } from '../../utils/validators';

export interface ActivityFormProps {
  initialData?: Partial<Activity>;
  submitLabel?: string;
  onSubmit: (data: {
    title: string;
    category: ActivityCategory;
    durationMinutes: number;
    date: string;
    notes?: string;
  }) => void;
  onCancel?: () => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  initialData,
  submitLabel,
  onSubmit,
  onCancel,
}) => {
  const todayIso = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<ActivityCategory>(initialData?.category || 'Coding');
  const [durationMinutes, setDurationMinutes] = useState<string>(
    initialData?.durationMinutes !== undefined ? String(initialData.durationMinutes) : '60'
  );
  const [date, setDate] = useState(initialData?.date || todayIso);
  const [notes, setNotes] = useState(initialData?.notes || '');

  const [errors, setErrors] = useState<{ title?: string; duration?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; duration?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Activity title is required.';
    }

    const durResult = validateDurationMinutes(durationMinutes);
    if (!durResult.isValid) {
      newErrors.duration = durResult.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      title: title.trim(),
      category,
      durationMinutes: durResult.value,
      date,
      notes: notes.trim() || undefined,
    });

    if (!initialData) {
      // Reset form fields only on creation
      setTitle('');
      setDurationMinutes('60');
      setNotes('');
    }
  };

  const categoryOptions = ACTIVITY_CATEGORIES.map(cat => ({
    value: cat,
    label: cat,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="activity-title"
        label="Activity Title"
        placeholder="e.g. Vitest Unit Testing & Code Review"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
        }}
        error={errors.title}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="activity-category"
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value as ActivityCategory)}
          required
        />

        <Input
          id="activity-duration"
          label="Duration (Minutes)"
          type="number"
          min="1"
          max="1440"
          placeholder="60"
          helperText="e.g. 90 = 01h 30m"
          value={durationMinutes}
          onChange={(e) => {
            setDurationMinutes(e.target.value);
            if (errors.duration) setErrors(prev => ({ ...prev, duration: undefined }));
          }}
          error={errors.duration}
          required
        />
      </div>

      <Input
        id="activity-date"
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="activity-notes" className="text-sm font-medium text-neutral-200">
          Notes (Optional)
        </label>
        <textarea
          id="activity-notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Brief reflection or milestone achieved..."
          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 text-sm"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
        {onCancel && (
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button variant="primary" size="md" type="submit">
          {submitLabel || (initialData ? 'Update Activity' : 'Log Activity')}
        </Button>
      </div>
    </form>
  );
};
