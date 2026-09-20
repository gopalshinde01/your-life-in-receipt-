import React, { useState, useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Card } from '../components/common/Card';
import { EXPENSE_CATEGORIES } from '../constants';
import { useLifeData } from '../hooks/useLifeData';
import { calculateTotalExpenses } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

export interface ExpensesPageProps {
  lifeData: ReturnType<typeof useLifeData>;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ lifeData, onShowToast }) => {
  const { expenses, profile, addExpense, deleteExpense } = lifeData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchCat = selectedCategory === 'All' || exp.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [expenses, selectedCategory, searchQuery]);

  const totalFilteredAmount = useMemo(() => {
    return calculateTotalExpenses(filteredExpenses);
  }, [filteredExpenses]);

  const handleAddSubmit = (data: Parameters<typeof addExpense>[0]) => {
    try {
      addExpense(data);
      setIsModalOpen(false);
      onShowToast('Expense Logged', `${data.description} added successfully.`, 'success');
    } catch (err: any) {
      onShowToast('Error', err.message, 'error');
    }
  };

  return (
    <PageContainer
      title="Expenses & Outflows"
      subtitle="Track your day-to-day capital allocation without connecting bank credentials."
      action={
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          + Add Expense
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filter and Metrics Bar */}
        <Card className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 max-w-sm">
            <label htmlFor="expense-search" className="sr-only">
              Search expenses
            </label>
            <input
              id="expense-search"
              type="search"
              placeholder="Search by description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[44px]"
            />
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto font-mono text-sm">
            <span className="text-neutral-400">Total Spent:</span>
            <span className="text-emerald-400 font-bold text-base">
              {formatCurrency(totalFilteredAmount, profile.currency)}
            </span>
          </div>
        </Card>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2" role="group" aria-label="Filter by expense category">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[36px] ${
              selectedCategory === 'All'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            All ({expenses.length})
          </button>
          {EXPENSE_CATEGORIES.map((cat) => {
            const count = expenses.filter(e => e.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[36px] whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Expenses Feed */}
        <ExpenseList
          expenses={filteredExpenses}
          currency={profile.currency}
          onDelete={deleteExpense}
          onAddClick={() => setIsModalOpen(true)}
        />

        {/* Add Expense Accessible Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Log Expense"
        >
          <ExpenseForm
            currency={profile.currency}
            onSubmit={handleAddSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </PageContainer>
  );
};
