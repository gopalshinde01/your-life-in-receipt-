import { describe, it, expect } from 'vitest';
import {
  calculateTotalExpenses,
  calculateTotalTime,
  calculateProductivityScore,
  calculateLifeScore,
  calculateMoodAverage,
  calculateGoalProgress,
} from '../utils/calculations';
import { Activity, Expense, Goal, MoodEntry } from '../types';

describe('Business Logic & Calculations', () => {
  it('calculates total expenses correctly and rounds to 2 decimals', () => {
    const expenses: Expense[] = [
      { id: '1', amount: 180.50, category: 'Food', description: 'Lunch', date: '2026-09-20', createdAt: 1 },
      { id: '2', amount: 80.25, category: 'Travel', description: 'Metro', date: '2026-09-20', createdAt: 2 },
      { id: '3', amount: 50.00, category: 'Entertainment', description: 'Game', date: '2026-09-20', createdAt: 3 },
    ];

    expect(calculateTotalExpenses(expenses)).toBe(310.75);
    expect(calculateTotalExpenses([])).toBe(0);
  });

  it('filters expenses by date accurately', () => {
    const expenses: Expense[] = [
      { id: '1', amount: 100, category: 'Food', description: 'Lunch', date: '2026-09-20', createdAt: 1 },
      { id: '2', amount: 50, category: 'Travel', description: 'Bus', date: '2026-09-19', createdAt: 2 },
    ];

    expect(calculateTotalExpenses(expenses, '2026-09-20')).toBe(100);
    expect(calculateTotalExpenses(expenses, '2026-09-19')).toBe(50);
    expect(calculateTotalExpenses(expenses, '2026-09-18')).toBe(0);
  });

  it('calculates total activity time in minutes', () => {
    const activities: Activity[] = [
      { id: '1', title: 'Coding', category: 'Coding', durationMinutes: 150, date: '2026-09-20', createdAt: 1 },
      { id: '2', title: 'Exercise', category: 'Exercise', durationMinutes: 45, date: '2026-09-20', createdAt: 2 },
    ];

    expect(calculateTotalTime(activities)).toBe(195);
    expect(calculateTotalTime([])).toBe(0);
  });

  it('calculates productivity score within bounds [0, 100]', () => {
    const activities: Activity[] = [
      { id: '1', title: 'Coding', category: 'Coding', durationMinutes: 180, date: '2026-09-20', createdAt: 1 },
      { id: '2', title: 'Study', category: 'Study', durationMinutes: 120, date: '2026-09-20', createdAt: 2 },
    ];

    const score = calculateProductivityScore(activities);
    expect(score).toBeGreaterThanOrEqual(50);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('calculates average mood and clamped scale', () => {
    const moods: MoodEntry[] = [
      { id: '1', rating: 8, date: '2026-09-20', createdAt: 1 },
      { id: '2', rating: 6, date: '2026-09-20', createdAt: 2 },
    ];

    const res = calculateMoodAverage(moods);
    expect(res.average).toBe(7);
    expect(res.scoreScaled).toBe(70);

    const emptyRes = calculateMoodAverage([]);
    expect(emptyRes.average).toBeNull();
    expect(emptyRes.scoreScaled).toBe(70);
  });

  it('calculates goal progress clamped between 0 and 100', () => {
    const goals: Goal[] = [
      { id: '1', title: 'Goal A', category: 'Dev', targetDate: '2026-09-20', progress: 100, completed: true, createdAt: 1 },
      { id: '2', title: 'Goal B', category: 'Dev', targetDate: '2026-09-20', progress: 50, completed: false, createdAt: 2 },
    ];

    expect(calculateGoalProgress(goals)).toBe(75);
    expect(calculateGoalProgress([])).toBe(60);
  });

  it('calculates transparent Life Score clamped from 0 to 100 with explanation', () => {
    const activities: Activity[] = [
      { id: '1', title: 'Coding', category: 'Coding', durationMinutes: 150, date: '2026-09-20', createdAt: 1 },
      { id: '2', title: 'Exercise', category: 'Exercise', durationMinutes: 40, date: '2026-09-20', createdAt: 2 },
    ];
    const goals: Goal[] = [
      { id: '1', title: 'Milestone', category: 'Dev', targetDate: '2026-09-20', progress: 100, completed: true, createdAt: 1 },
    ];
    const moods: MoodEntry[] = [
      { id: '1', rating: 8, date: '2026-09-20', createdAt: 1 },
    ];

    const result = calculateLifeScore({ activities, goals, moods });
    expect(result.finalScore).toBeGreaterThanOrEqual(0);
    expect(result.finalScore).toBeLessThanOrEqual(100);
    expect(result.productivity).toBeDefined();
    expect(result.health).toBeDefined();
    expect(result.mood).toBeDefined();
    expect(result.goals).toBeDefined();
    expect(result.balance).toBeDefined();
    expect(result.explanation.length).toBeGreaterThan(5);
  });
});
