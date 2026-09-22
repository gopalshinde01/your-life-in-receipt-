import { useState, useEffect, useCallback } from 'react';
import { Activity, Expense, Goal, MoodEntry, NoteEntry, UserProfile } from '../types';
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

  const [notes, setNotes] = useState<NoteEntry[]>(() =>
    storageService.getItem<NoteEntry[]>(STORAGE_KEYS.NOTES, [])
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
    storageService.setItem(STORAGE_KEYS.NOTES, notes);
  }, [notes]);

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

  const updateActivity = useCallback((id: string, updates: Partial<Omit<Activity, 'id' | 'createdAt'>>) => {
    setActivities(prev =>
      prev.map(a => {
        if (a.id !== id) return a;
        let dur = a.durationMinutes;
        if (updates.durationMinutes !== undefined) {
          const val = validateDurationMinutes(updates.durationMinutes);
          if (val.isValid) dur = val.value;
        }
        return {
          ...a,
          ...updates,
          title: updates.title !== undefined ? sanitizeString(updates.title, 80) || a.title : a.title,
          category: updates.category || a.category,
          durationMinutes: dur,
          notes: updates.notes !== undefined ? (updates.notes ? sanitizeString(updates.notes, 250) : undefined) : a.notes,
        };
      })
    );
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

  const updateExpense = useCallback((id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    setExpenses(prev =>
      prev.map(e => {
        if (e.id !== id) return e;
        let amt = e.amount;
        if (updates.amount !== undefined) {
          const val = validateExpenseAmount(updates.amount);
          if (val.isValid) amt = val.value;
        }
        return {
          ...e,
          ...updates,
          amount: amt,
          category: updates.category || e.category,
          description: updates.description !== undefined ? sanitizeString(updates.description, 100) || e.description : e.description,
        };
      })
    );
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

  const updateGoal = useCallback((id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const prog = updates.progress !== undefined ? clampGoalProgress(updates.progress) : g.progress;
        return {
          ...g,
          ...updates,
          title: updates.title !== undefined ? sanitizeString(updates.title, 80) || g.title : g.title,
          category: updates.category !== undefined ? sanitizeString(updates.category, 40) || g.category : g.category,
          progress: prog,
          completed: updates.completed !== undefined ? updates.completed : (prog >= 100 ? true : g.completed),
        };
      })
    );
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

  // Note Actions
  const addNote = useCallback((data: { title: string; description: string; date?: string }) => {
    const safeDate = data.date || new Date().toISOString().slice(0, 10);
    const newNote: NoteEntry = {
      id: generateSafeId('note'),
      title: sanitizeString(data.title, 100) || 'Untitled Note',
      description: sanitizeString(data.description, 1000) || '',
      date: safeDate,
      createdAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Omit<NoteEntry, 'id' | 'createdAt'>>) => {
    setNotes(prev =>
      prev.map(n => {
        if (n.id !== id) return n;
        return {
          ...n,
          ...updates,
          title: updates.title !== undefined ? sanitizeString(updates.title, 100) || n.title : n.title,
          description: updates.description !== undefined ? sanitizeString(updates.description, 1000) : n.description,
        };
      })
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
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
    setNotes([]);
    setProfile(SEED_PROFILE);
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    setActivities([]);
    setExpenses([]);
    setGoals([]);
    setMoods([]);
    setNotes([]);
  }, []);

  return {
    activities,
    expenses,
    goals,
    moods,
    notes,
    profile,
    addActivity,
    updateActivity,
    deleteActivity,
    addExpense,
    updateExpense,
    deleteExpense,
    addGoal,
    updateGoal,
    updateGoalProgress,
    toggleGoalCompleted,
    deleteGoal,
    logMood,
    addNote,
    updateNote,
    deleteNote,
    updateProfile,
    resetToSeedData,
    clearAllData,
  };
}
