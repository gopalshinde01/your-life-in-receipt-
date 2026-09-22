import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseForm } from '../components/expenses/ExpenseForm';

describe('Expense Component & Form Validation', () => {
  it('submits valid expense successfully', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ExpenseForm currency="₹" onSubmit={handleSubmit} />);

    const amountInput = screen.getByLabelText(/Amount/i);
    const descInput = screen.getByLabelText(/Description/i);
    const submitBtn = screen.getByRole('button', { name: /Log Expense/i });

    await user.clear(amountInput);
    await user.type(amountInput, '250.50');
    await user.type(descInput, 'Technical Book on Distributed Systems');
    await user.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 250.5,
        description: 'Technical Book on Distributed Systems',
        category: 'Food', // default
      })
    );
  });

  it('rejects negative amount and displays accessible error', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ExpenseForm currency="₹" onSubmit={handleSubmit} />);

    const amountInput = screen.getByLabelText(/Amount/i);
    const descInput = screen.getByLabelText(/Description/i);
    const submitBtn = screen.getByRole('button', { name: /Log Expense/i });

    await user.clear(amountInput);
    await user.type(amountInput, '-100');
    await user.type(descInput, 'Invalid Negative Expense');
    await user.click(submitBtn);

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Amount cannot be negative/i)).toBeInTheDocument();
  });

  it('prepopulates initialData in edit mode and allows updating', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    const existingExpense = {
      id: 'exp_123',
      amount: 450,
      category: 'Education' as const,
      description: 'System Architecture Handbook',
      date: '2026-03-20',
      createdAt: Date.now(),
    };

    render(
      <ExpenseForm
        initialData={existingExpense}
        submitLabel="Update Expense"
        currency="₹"
        onSubmit={handleSubmit}
      />
    );

    const amountInput = screen.getByLabelText(/Amount/i) as HTMLInputElement;
    const descInput = screen.getByLabelText(/Description/i) as HTMLInputElement;
    const submitBtn = screen.getByRole('button', { name: /Update Expense/i });

    expect(amountInput.value).toBe('450');
    expect(descInput.value).toBe('System Architecture Handbook');

    await user.clear(amountInput);
    await user.type(amountInput, '550');
    await user.clear(descInput);
    await user.type(descInput, 'Advanced System Architecture Handbook');
    await user.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 550,
        description: 'Advanced System Architecture Handbook',
      })
    );
  });
});
