import { useState, useEffect, useCallback } from 'react';
import { Activity, Expense, Goal, MoodEntry, UserProfile } from '../types';
import { STORAGE_KEYS } from '../constants';
import { storageService } from '../services/storageService';
import { SEED_ACTIVITIES, SEED_EXPENSES, SEED_GOALS, SEED_MOODS, SEED_PROFILE } from '../data/initialSeedData';
import { generateSafeId, sanitizeString } from '../utils/sanitizers';
import { validateExpenseAmount, validateDurationMinutes, clampGoalProgress, clampMood } from '../utils/validators';

export function useLifeData() {
  const [activities, setActivities] = useState<Activity[]>(() =>
    storageService.getItem<Activity[]>(STORAGE_KEYS.ACTIVITIES, SEED_ACTIVITIES)
  );

  const [expenses, setExpenses] = useState<Expense[]>(() =>
    storageService.getItem<Expense[]>(STORAGE_KEYS.EXPENSES, SEED_EXPENSES)
  );

  const [goals, setGoals] = useState<Goal[]>(() =>
    storageService.getItem<Goal[]>(STORAGE_KEYS.GOALS, SEED_GOALS)
  );

  const [moods, setMoods] = useState<MoodEntry[]>(() =>
    storageService.getItem<MoodEntry[]>(STORAGE_KEYS.MOODS, SEED_MOODS)
  );

  const [profile, setProfile] = useState<UserProfile>(() =>
    storageService.getItem<UserProfile>(STORAGE_KEYS.PROFILE, SEED_PROFILE)
  );

  // Sync to storage on change
  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.ACTIVITIES, activities);
  }, [activities]);

  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.EXPENSES, expenses);
  }, [expenses]);

  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.GOALS, goals);
  }, [goals]);

  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.MOODS, moods);
  }, [moods]);

  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.PROFILE, profile);
  }, [profile]);

  // Activity Actions
  const addActivity = useCallback((data: Omit<Activity, 'id' | 'createdAt'>) => {
    const durValidation = validateDurationMinutes(data.durationMinutes);
    if (!durValidation.isValid) {
      throw new Error(durValidation.error || 'Invalid duration');
    }

    const newActivity: Activity = {
      id: generateSafeId('act'),
      title: sanitizeString(data.title, 80) || 'Untitled Activity',
      category: data.category,
      durationMinutes: durValidation.value,
      date: data.date,
      notes: data.notes ? sanitizeString(data.notes, 250) : undefined,
      createdAt: Date.now(),
    };

    setActivities(prev => [newActivity, ...prev]);
    return newActivity;
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  }, []);

  // Expense Actions
  const addExpense = useCallback((data: Omit<Expense, 'id' | 'createdAt'>) => {
    const amtValidation = validateExpenseAmount(data.amount);
    if (!amtValidation.isValid) {
      throw new Error(amtValidation.error || 'Invalid amount');
    }

    const newExpense: Expense = {
      id: generateSafeId('exp'),
      amount: amtValidation.value,
      category: data.category,
      description: sanitizeString(data.description, 100) || 'General Expense',
      date: data.date,
      createdAt: Date.now(),
    };

    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  // Goal Actions
  const addGoal = useCallback((data: Omit<Goal, 'id' | 'createdAt'>) => {
    const clampedProg = clampGoalProgress(data.progress);
    const newGoal: Goal = {
      id: generateSafeId('goal'),
      title: sanitizeString(data.title, 80) || 'Untitled Goal',
      category: sanitizeString(data.category, 40) || 'General',
      targetDate: data.targetDate,
      progress: clampedProg,
      completed: data.completed || clampedProg >= 100,
      createdAt: Date.now(),
    };

    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  }, []);

  const updateGoalProgress = useCallback((id: string, progress: number) => {
    const clamped = clampGoalProgress(progress);
    setGoals(prev =>
      prev.map(g =>
        g.id === id
          ? { ...g, progress: clamped, completed: clamped >= 100 ? true : g.completed }
          : g
      )
    );
  }, []);

  const toggleGoalCompleted = useCallback((id: string) => {
    setGoals(prev =>
      prev.map(g =>
        g.id === id ? { ...g, completed: !g.completed, progress: !g.completed ? 100 : g.progress } : g
      )
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  // Mood Actions
  const logMood = useCallback((rating: number, note?: string, date?: string) => {
    const safeRating = clampMood(rating);
    const safeDate = date || new Date().toISOString().slice(0, 10);
    const newMood: MoodEntry = {
      id: generateSafeId('mood'),
      rating: safeRating,
      note: note ? sanitizeString(note, 200) : undefined,
      date: safeDate,
      createdAt: Date.now(),
    };

    setMoods(prev => [newMood, ...prev]);
    return newMood;
  }, []);

  // Profile Actions
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({
      ...prev,
      name: updates.name ? sanitizeString(updates.name, 50) : prev.name,
      headline: updates.headline ? sanitizeString(updates.headline, 100) : prev.headline,
      currency: updates.currency ? sanitizeString(updates.currency, 5) : prev.currency,
      lifePhilosophy: updates.lifePhilosophy ? sanitizeString(updates.lifePhilosophy, 200) : prev.lifePhilosophy,
      targetSleepHours: updates.targetSleepHours ? Math.min(14, Math.max(4, updates.targetSleepHours)) : prev.targetSleepHours,
    }));
  }, []);

  // Reset to initial seed
  const resetToSeedData = useCallback(() => {
    setActivities(SEED_ACTIVITIES);
    setExpenses(SEED_EXPENSES);
    setGoals(SEED_GOALS);
    setMoods(SEED_MOODS);
    setProfile(SEED_PROFILE);
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    setActivities([]);
    setExpenses([]);
    setGoals([]);
    setMoods([]);
  }, []);

  return {
    activities,
    expenses,
    goals,
    moods,
    profile,
    addActivity,
    deleteActivity,
    addExpense,
    deleteExpense,
    addGoal,
    updateGoalProgress,
    toggleGoalCompleted,
    deleteGoal,
    logMood,
    updateProfile,
    resetToSeedData,
    clearAllData,
  };
}
