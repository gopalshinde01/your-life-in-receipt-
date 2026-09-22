import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LifeReceipt } from '../components/receipt/LifeReceipt';
import { receiptService } from '../services/receiptService';
import { SEED_ACTIVITIES, SEED_EXPENSES, SEED_GOALS, SEED_MOODS, SEED_PROFILE } from '../data/initialSeedData';

describe('Receipt Component & Presentation', () => {
  it('renders the Life Receipt with all required sections and data', () => {
    const receiptData = receiptService.generateReceiptData({
      activities: SEED_ACTIVITIES,
      expenses: SEED_EXPENSES,
      goals: SEED_GOALS,
      moods: SEED_MOODS,
      profile: SEED_PROFILE,
      filterDate: '2026-09-20',
    });

    render(<LifeReceipt receiptData={receiptData} />);

    // Header checks
    expect(screen.getByText(/YOUR LIFE RECEIPT/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(SEED_PROFILE.name, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/20 SEP 2026/i)).toBeInTheDocument();

    // Section checks
    expect(screen.getByText(/TIME SPENT/i)).toBeInTheDocument();
    expect(screen.getAllByText(/MONEY SPENT/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/LIFE SCORE/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/THANK YOU FOR LIVING/i)).toBeInTheDocument();

    // Data values checks
    expect(screen.getAllByText(/₹310/i).length).toBeGreaterThanOrEqual(1); // total expenses
    expect(screen.getByText(/Coding/i)).toBeInTheDocument();
    expect(screen.getByText(/Food/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Completed project/i).length).toBeGreaterThanOrEqual(1);
  });
});
