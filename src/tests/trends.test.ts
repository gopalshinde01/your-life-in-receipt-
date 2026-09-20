import { describe, it, expect } from 'vitest';
import { trendService, calculatePercentageChange } from '../services/trendService';
import { Activity, Expense, MoodEntry } from '../types';

describe('Trend Analysis & Percentage Math', () => {
  it('correctly calculates percentage deltas including zero base edge cases', () => {
    expect(calculatePercentageChange(150, 100)).toBe(50);
    expect(calculatePercentageChange(80, 100)).toBe(-20);
    expect(calculatePercentageChange(100, 0)).toBe(100);
    expect(calculatePercentageChange(0, 0)).toBe(0);
  });

  it('computes weekly productive time deltas and generates highlights', () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const tenDaysAgoStr = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const mockActivities: Activity[] = [
      {
        id: '1',
        title: 'Deep Coding',
        category: 'Coding',
        durationMinutes: 180,
        date: todayStr,
        createdAt: Date.now(),
      },
      {
        id: '2',
        title: 'Prior Study',
        category: 'Study',
        durationMinutes: 90,
        date: tenDaysAgoStr,
        createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      },
    ];

    const mockExpenses: Expense[] = [
      {
        id: 'e1',
        description: 'Groceries',
        category: 'Food',
        amount: 50,
        date: todayStr,
        createdAt: Date.now(),
      },
      {
        id: 'e2',
        description: 'Previous Groceries',
        category: 'Food',
        amount: 100,
        date: tenDaysAgoStr,
        createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      },
    ];

    const mockMoods: MoodEntry[] = [
      { id: 'm1', rating: 9, date: todayStr, createdAt: Date.now() },
      { id: 'm2', rating: 7, date: tenDaysAgoStr, createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000 },
    ];

    const trends = trendService.analyzeWeeklyTrends({
      activities: mockActivities,
      expenses: mockExpenses,
      moods: mockMoods,
    });

    expect(trends.thisWeek.productiveMinutes).toBe(180);
    expect(trends.previousWeek.productiveMinutes).toBe(90);
    expect(trends.productiveHoursDeltaPercent).toBe(100);
    expect(trends.totalExpensesDeltaPercent).toBe(-50);
    expect(trends.moodDelta).toBe(2);
    expect(trends.trendHighlights.length).toBeGreaterThan(0);
    expect(trends.trendHighlights.some(h => h.includes('productive hours increased'))).toBe(true);
  });
});
