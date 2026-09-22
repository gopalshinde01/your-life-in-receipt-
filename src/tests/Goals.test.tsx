import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalForm } from '../components/goals/GoalForm';
import { Goal } from '../types';

describe('Goals Component & Progress', () => {
  const mockGoal: Goal = {
    id: 'goal_test',
    title: 'Ship Optimized Frontend Hackathon Project',
    category: 'Engineering',
    targetDate: '2026-09-20',
    progress: 80,
    completed: false,
    createdAt: 1,
  };

  it('renders goal title and progress accurately', () => {
    render(
      <GoalCard
        goal={mockGoal}
        onUpdateProgress={vi.fn()}
        onToggleComplete={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Ship Optimized Frontend Hackathon Project')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('allows toggling completion state via keyboard or click', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(
      <GoalCard
        goal={mockGoal}
        onUpdateProgress={vi.fn()}
        onToggleComplete={handleToggle}
        onDelete={vi.fn()}
      />
    );

    const toggleBtn = screen.getByRole('button', { name: /Mark .* as completed/i });
    await user.click(toggleBtn);

    expect(handleToggle).toHaveBeenCalledWith('goal_test');
  });

  it('invokes onEdit when edit button is clicked on GoalCard', async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();

    render(
      <GoalCard
        goal={mockGoal}
        onUpdateProgress={vi.fn()}
        onToggleComplete={vi.fn()}
        onDelete={vi.fn()}
        onEdit={handleEdit}
      />
    );

    const editBtn = screen.getByRole('button', { name: /Edit goal/i });
    await user.click(editBtn);

    expect(handleEdit).toHaveBeenCalledWith(mockGoal);
  });

  it('prepopulates initialData in GoalForm and updates goal on submit', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <GoalForm
        initialData={mockGoal}
        submitLabel="Update Goal"
        onSubmit={handleSubmit}
      />
    );

    const titleInput = screen.getByLabelText(/Goal Title/i) as HTMLInputElement;
    const submitBtn = screen.getByRole('button', { name: /Update Goal/i });

    expect(titleInput.value).toBe('Ship Optimized Frontend Hackathon Project');

    await user.clear(titleInput);
    await user.type(titleInput, 'Ship Production Release v2');
    await user.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Ship Production Release v2',
        category: 'Engineering',
        progress: 80,
      })
    );
  });
});
