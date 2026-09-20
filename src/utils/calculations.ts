import { Activity, Expense, Goal, MoodEntry, LifeScoreBreakdown } from '../types';
import { LIFE_SCORE_WEIGHTS } from '../constants';
import { formatMinutesToHoursMinutes, formatCurrency } from './formatters';

/**
 * Calculates total expenses with optional date filtering
 */
export function calculateTotalExpenses(expenses: Expense[], filterDate?: string): number {
  if (!Array.isArray(expenses) || expenses.length === 0) return 0;
  
  const filtered = filterDate 
    ? expenses.filter(e => e.date === filterDate)
    : expenses;

  const total = filtered.reduce((acc, curr) => {
    const val = Number(curr.amount);
    return acc + (Number.isFinite(val) && val > 0 ? val : 0);
  }, 0);

  return Math.round(total * 100) / 100;
}

/**
 * Calculates total activity time in minutes with optional date filtering
 */
export function calculateTotalTime(activities: Activity[], filterDate?: string): number {
  if (!Array.isArray(activities) || activities.length === 0) return 0;

  const filtered = filterDate
    ? activities.filter(a => a.date === filterDate)
    : activities;

  return filtered.reduce((acc, curr) => {
    const val = Number(curr.durationMinutes);
    return acc + (Number.isFinite(val) && val > 0 ? Math.floor(val) : 0);
  }, 0);
}

/**
 * Calculates productivity score (0-100) based on constructive activities:
 * (Coding, Study, Work, Reading) vs distracting categories (Social Media, Entertainment)
 */
export function calculateProductivityScore(activities: Activity[], filterDate?: string): number {
  if (!Array.isArray(activities) || activities.length === 0) return 50; // Neutral baseline

  const filtered = filterDate ? activities.filter(a => a.date === filterDate) : activities;
  if (filtered.length === 0) return 50;

  let constructiveMinutes = 0;
  let distractingMinutes = 0;
  let totalTracked = 0;

  filtered.forEach(act => {
    const min = Math.max(0, act.durationMinutes || 0);
    totalTracked += min;

    switch (act.category) {
      case 'Coding':
      case 'Study':
      case 'Work':
      case 'Reading':
        constructiveMinutes += min;
        break;
      case 'Social Media':
      case 'Entertainment':
        distractingMinutes += min;
        break;
      default:
        constructiveMinutes += min * 0.5;
        break;
    }
  });

  if (totalTracked === 0) return 50;

  // Scale: 4+ hours of constructive time reaches near 90-100%, high distraction docks points
  const rawRatio = (constructiveMinutes - (distractingMinutes * 0.6)) / Math.max(totalTracked, 240);
  const score = Math.round(Math.min(100, Math.max(10, 50 + (rawRatio * 50))));
  return score;
}

/**
 * Calculates health score (0-100) based on exercise time and adequate sleep
 */
export function calculateHealthScore(activities: Activity[], filterDate?: string): number {
  if (!Array.isArray(activities) || activities.length === 0) return 50;

  const filtered = filterDate ? activities.filter(a => a.date === filterDate) : activities;
  
  let exerciseMinutes = 0;
  let sleepMinutes = 0;

  filtered.forEach(a => {
    if (a.category === 'Exercise') exerciseMinutes += a.durationMinutes;
    if (a.category === 'Sleep') sleepMinutes += a.durationMinutes;
  });

  // Target: ~30-45 mins exercise gives up to 60 pts, ~7-8 hours sleep gives up to 40 pts
  const exerciseScore = Math.min(60, (exerciseMinutes / 45) * 60);
  const sleepHours = sleepMinutes / 60;
  const sleepScore = sleepHours >= 7 && sleepHours <= 9 
    ? 40 
    : sleepHours > 0 
      ? Math.max(10, 40 - Math.abs(8 - sleepHours) * 10) 
      : 25;

  return Math.min(100, Math.max(20, Math.round(exerciseScore + sleepScore)));
}

/**
 * Calculates average mood score (1-10 mapped to 0-100 scale)
 */
export function calculateMoodAverage(moods: MoodEntry[], filterDate?: string): { average: number | null; scoreScaled: number } {
  if (!Array.isArray(moods) || moods.length === 0) {
    return { average: null, scoreScaled: 70 }; // Default baseline
  }

  const filtered = filterDate ? moods.filter(m => m.date === filterDate) : moods;
  const list = filtered.length > 0 ? filtered : moods;

  const sum = list.reduce((acc, curr) => acc + (curr.rating || 5), 0);
  const avg = Math.round((sum / list.length) * 10) / 10;
  const scaled = Math.min(100, Math.max(10, Math.round(avg * 10)));

  return { average: avg, scoreScaled: scaled };
}

/**
 * Calculates overall goals completion and progress score (0-100)
 */
export function calculateGoalProgress(goals: Goal[]): number {
  if (!Array.isArray(goals) || goals.length === 0) return 60; // Baseline when no goals set yet

  const totalProgress = goals.reduce((acc, g) => {
    const val = g.completed ? 100 : Math.min(100, Math.max(0, g.progress || 0));
    return acc + val;
  }, 0);

  return Math.min(100, Math.max(0, Math.round(totalProgress / goals.length)));
}

/**
 * Calculates life balance score based on multi-category variety vs single-activity obsession
 */
export function calculateBalanceScore(activities: Activity[], filterDate?: string): number {
  if (!Array.isArray(activities) || activities.length === 0) return 60;

  const filtered = filterDate ? activities.filter(a => a.date === filterDate) : activities;
  if (filtered.length === 0) return 60;

  const categorySet = new Set(filtered.map(a => a.category));
  // Variety of categories (3+ categories tracked indicates balanced awareness)
  const categoryScore = Math.min(100, categorySet.size * 25);
  return categoryScore;
}

/**
 * Transparent Life Score computation with detailed sub-factor breakdown.
 * Formula:
 * Final = (Productivity * 0.30) + (Health * 0.20) + (Mood * 0.20) + (Goals * 0.20) + (Balance * 0.10)
 * Clamped 0–100.
 */
export function calculateLifeScore(params: {
  activities: Activity[];
  goals: Goal[];
  moods: MoodEntry[];
  filterDate?: string;
}): LifeScoreBreakdown {
  const { activities, goals, moods, filterDate } = params;

  const productivity = calculateProductivityScore(activities, filterDate);
  const health = calculateHealthScore(activities, filterDate);
  const { scoreScaled: moodScore } = calculateMoodAverage(moods, filterDate);
  const goalsScore = calculateGoalProgress(goals);
  const balance = calculateBalanceScore(activities, filterDate);

  const weighted = 
    (productivity * LIFE_SCORE_WEIGHTS.PRODUCTIVITY) +
    (health * LIFE_SCORE_WEIGHTS.HEALTH) +
    (moodScore * LIFE_SCORE_WEIGHTS.MOOD) +
    (goalsScore * LIFE_SCORE_WEIGHTS.GOALS) +
    (balance * LIFE_SCORE_WEIGHTS.BALANCE);

  const finalScore = Math.min(100, Math.max(0, Math.round(weighted)));

  let explanation = 'Solid daily momentum across work, habits, and self-care.';
  if (finalScore >= 85) {
    explanation = 'Exceptional alignment: High constructive engagement, consistent health habits, and positive mood.';
  } else if (finalScore <= 55) {
    explanation = 'Opportunities for balance: Consider taking dedicated rest and reducing passive entertainment.';
  }

  return {
    productivity,
    health,
    mood: moodScore,
    goals: goalsScore,
    balance,
    finalScore,
    explanation,
  };
}

/**
 * Groups time spent by category and returns sorted descending list
 */
export function groupTimeByCategory(activities: Activity[], filterDate?: string) {
  const filtered = filterDate ? activities.filter(a => a.date === filterDate) : activities;
  const map = new Map<string, number>();

  filtered.forEach(a => {
    const current = map.get(a.category) || 0;
    map.set(a.category, current + Math.max(0, a.durationMinutes || 0));
  });

  return Array.from(map.entries())
    .map(([category, minutes]) => ({
      category,
      minutes,
      formatted: formatMinutesToHoursMinutes(minutes),
    }))
    .sort((a, b) => b.minutes - a.minutes);
}

/**
 * Groups expenses by category and returns sorted descending list
 */
export function groupExpensesByCategory(expenses: Expense[], currency = '₹', filterDate?: string) {
  const filtered = filterDate ? expenses.filter(e => e.date === filterDate) : expenses;
  const map = new Map<string, number>();

  filtered.forEach(e => {
    const current = map.get(e.category) || 0;
    map.set(e.category, current + Math.max(0, e.amount || 0));
  });

  return Array.from(map.entries())
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      formatted: formatCurrency(amount, currency),
    }))
    .sort((a, b) => b.amount - a.amount);
}
