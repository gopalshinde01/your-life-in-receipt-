import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActivityForm } from '../components/activities/ActivityForm';

describe('Activity Component & Validation', () => {
  it('submits valid activity with correct duration', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ActivityForm onSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/Activity Title/i);
    const durationInput = screen.getByLabelText(/Duration/i);
    const submitBtn = screen.getByRole('button', { name: /Log Activity/i });

    await user.type(titleInput, 'Deep Work Session');
    await user.clear(durationInput);
    await user.type(durationInput, '90');
    await user.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Deep Work Session',
        durationMinutes: 90,
      })
    );
  });

  it('rejects duration greater than 24 hours (1440 mins) with error message', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ActivityForm onSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/Activity Title/i);
    const durationInput = screen.getByLabelText(/Duration/i);
    const submitBtn = screen.getByRole('button', { name: /Log Activity/i });

    await user.type(titleInput, 'Unrealistic Marathon');
    await user.clear(durationInput);
    await user.type(durationInput, '2000');
    await user.click(submitBtn);

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/cannot exceed 1440 minutes/i)).toBeInTheDocument();
  });

  it('prepopulates initialData in edit mode and allows updating', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    const existingActivity = {
      id: 'act_123',
      title: 'Writing Unit Tests',
      category: 'Coding' as const,
      durationMinutes: 45,
      date: '2026-03-20',
      notes: 'Initial test setup',
      createdAt: Date.now(),
    };

    render(
      <ActivityForm
        initialData={existingActivity}
        submitLabel="Update Activity"
        onSubmit={handleSubmit}
      />
    );

    const titleInput = screen.getByLabelText(/Activity Title/i) as HTMLInputElement;
    const durationInput = screen.getByLabelText(/Duration/i) as HTMLInputElement;
    const submitBtn = screen.getByRole('button', { name: /Update Activity/i });

    expect(titleInput.value).toBe('Writing Unit Tests');
    expect(durationInput.value).toBe('45');

    await user.clear(titleInput);
    await user.type(titleInput, 'Writing Integration Tests');
    await user.clear(durationInput);
    await user.type(durationInput, '75');
    await user.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Writing Integration Tests',
        durationMinutes: 75,
      })
    );
  });
});
