import React from 'react';
import { Expense } from '../../types';
import { ExpenseItem } from './ExpenseItem';
import { EmptyState } from '../common/EmptyState';

export interface ExpenseListProps {
  expenses: Expense[];
  currency?: string;
  onDelete: (id: string) => void;
  onEdit?: (expense: Expense) => void;
  onAddClick?: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  currency = '₹',
  onDelete,
  onEdit,
  onAddClick,
}) => {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title="No expenses logged yet"
        description="Record your daily financial outlays: food, transit, books, or tools."
        actionLabel="+ Add Your First Expense"
        onAction={onAddClick}
      />
    );
  }

  return (
    <div className="space-y-2.5" role="feed" aria-label="Expenses list">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          currency={currency}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
