import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLifeData } from '../hooks/useLifeData';

describe('CRUD Operations & State Mutations', () => {
  it('updates an existing activity with valid duration and title', () => {
    const { result } = renderHook(() => useLifeData());
    let actId = '';

    act(() => {
      const created = result.current.addActivity({
        title: 'Initial Coding',
        category: 'Coding',
        durationMinutes: 60,
        date: '2026-09-20',
      });
      actId = created.id;
    });

    act(() => {
      result.current.updateActivity(actId, {
        title: 'Advanced React Architecture',
        durationMinutes: 120,
      });
    });

    const updated = result.current.activities.find(a => a.id === actId);
    expect(updated).toBeDefined();
    expect(updated?.title).toBe('Advanced React Architecture');
    expect(updated?.durationMinutes).toBe(120);
  });

  it('updates an existing expense amount with boundary checking', () => {
    const { result } = renderHook(() => useLifeData());
    let expId = '';

    act(() => {
      const created = result.current.addExpense({
        description: 'Server Hosting',
        category: 'Utilities',
        amount: 250,
        date: '2026-09-20',
      });
      expId = created.id;
    });

    act(() => {
      result.current.updateExpense(expId, {
        amount: 500,
        description: 'Cloud Infrastructure Dedicated',
      });
    });

    const updated = result.current.expenses.find(e => e.id === expId);
    expect(updated).toBeDefined();
    expect(updated?.amount).toBe(500);
    expect(updated?.description).toBe('Cloud Infrastructure Dedicated');
  });

  it('updates goal progress and marks completed when hitting 100%', () => {
    const { result } = renderHook(() => useLifeData());
    let goalId = '';

    act(() => {
      const created = result.current.addGoal({
        title: 'Launch v2 Portfolio',
        category: 'Career',
        targetDate: '2026-10-01',
        progress: 40,
        completed: false,
      });
      goalId = created.id;
    });

    act(() => {
      result.current.updateGoal(goalId, {
        progress: 100,
      });
    });

    const updated = result.current.goals.find(g => g.id === goalId);
    expect(updated).toBeDefined();
    expect(updated?.progress).toBe(100);
    expect(updated?.completed).toBe(true);
  });
});
