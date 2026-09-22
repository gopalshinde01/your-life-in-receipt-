import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '../../types';
import { EXPENSE_CATEGORIES } from '../../constants';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { validateExpenseAmount } from '../../utils/validators';

export interface ExpenseFormProps {
  initialData?: Partial<Expense>;
  submitLabel?: string;
  currency?: string;
  onSubmit: (data: {
    amount: number;
    category: ExpenseCategory;
    description: string;
    date: string;
  }) => void;
  onCancel?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  submitLabel,
  currency = '₹',
  onSubmit,
  onCancel,
}) => {
  const todayIso = new Date().toISOString().slice(0, 10);

  const [amount, setAmount] = useState(
    initialData?.amount !== undefined ? String(initialData.amount) : ''
  );
  const [category, setCategory] = useState<ExpenseCategory>(initialData?.category || 'Food');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || todayIso);

  const [errors, setErrors] = useState<{ amount?: string; description?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { amount?: string; description?: string } = {};

    const amtResult = validateExpenseAmount(amount);
    if (!amtResult.isValid) {
      newErrors.amount = amtResult.error;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      amount: amtResult.value,
      category,
      description: description.trim(),
      date,
    });

    if (!initialData) {
      // Reset form
      setAmount('');
      setDescription('');
    }
  };

  const categoryOptions = EXPENSE_CATEGORIES.map(cat => ({
    value: cat,
    label: cat,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="expense-amount"
          label={`Amount (${currency})`}
          type="number"
          step="0.01"
          min="0"
          placeholder="180.00"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
          }}
          error={errors.amount}
          required
        />

        <Select
          id="expense-category"
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          required
        />
      </div>

      <Input
        id="expense-description"
        label="Description"
        placeholder="e.g. Wholesome Mediterranean lunch"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
        }}
        error={errors.description}
        required
      />

      <Input
        id="expense-date"
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
        {onCancel && (
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button variant="primary" size="md" type="submit">
          {submitLabel || (initialData ? 'Update Expense' : 'Log Expense')}
        </Button>
      </div>
    </form>
  );
};
