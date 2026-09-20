import { Activity, Expense, Goal, MoodEntry, MockInsight } from '../types';
import { generateSafeId } from '../utils/sanitizers';
import { formatCurrency, formatMinutesToHoursMinutes } from '../utils/formatters';

export interface InsightInputData {
  activities: Activity[];
  expenses: Expense[];
  goals: Goal[];
  moods: MoodEntry[];
  currency?: string;
  filterDate?: string;
}

/**
 * Deterministic local AI insight service.
 * Simulates thoughtful personal analytics reflections based strictly on local user state,
 * with clean interfaces ready for future LLM API integration.
 */
export const insightService = {
  /**
   * Generates a primary summary insight quote for the Life Receipt
   */
  generateReceiptInsight(data: InsightInputData): string {
    const { activities, expenses, moods, goals, filterDate } = data;
    const dayActivities = filterDate ? activities.filter(a => a.date === filterDate) : activities;
    const dayExpenses = filterDate ? expenses.filter(e => e.date === filterDate) : expenses;

    // Calculate category totals
    const catTotals = new Map<string, number>();
    dayActivities.forEach(a => {
      catTotals.set(a.category, (catTotals.get(a.category) || 0) + a.durationMinutes);
    });

    // Find highest duration productive category
    const productiveCategories = ['Study', 'Coding', 'Work', 'Exercise', 'Reading'];
    let topProductiveCat = '';
    let topProductiveMins = 0;
    catTotals.forEach((mins, cat) => {
      if (productiveCategories.includes(cat) && mins > topProductiveMins) {
        topProductiveMins = mins;
        topProductiveCat = cat;
      }
    });

    const codingMins = catTotals.get('Coding') || 0;
    const exerciseMins = catTotals.get('Exercise') || 0;
    const socialMins = catTotals.get('Social Media') || 0;
    const studyMins = (catTotals.get('Study') || 0) + (catTotals.get('Reading') || 0);
    const completedGoals = goals.filter(g => g.completed).length;

    if (topProductiveCat && topProductiveMins >= 90) {
      const formatted = formatMinutesToHoursMinutes(topProductiveMins);
      return `You spent ${formatted} on ${topProductiveCat} today — your largest productive activity.`;
    }

    if (codingMins >= 120 && exerciseMins >= 30) {
      return "High deep work backed with intentional movement. You balanced cognitive output with physical health.";
    }

    if (socialMins > 120 && codingMins < 60) {
      return "Social media was one of your largest time categories today. Consider carving out an uninterrupted focus block tomorrow.";
    }

    if (exerciseMins >= 45) {
      return "You prioritized physical endurance today. Exercise provides compound returns on clarity and energy.";
    }

    if (studyMins >= 90) {
      return "Curiosity-led day: Substantial reading and exploration expanded your mental models.";
    }

    if (completedGoals > 0) {
      return `Milestone unlocked: You crossed off ${completedGoals} key goal${completedGoals > 1 ? 's' : ''}, moving the needle forward.`;
    }

    if (dayExpenses.length > 0) {
      const foodSpend = dayExpenses.filter(e => e.category === 'Food').reduce((acc, c) => acc + c.amount, 0);
      if (foodSpend > 500) {
        return "Nourishment and social dining were prominent in today's expenses.";
      }
    }

    const latestMood = moods[moods.length - 1];
    if (latestMood && latestMood.rating >= 8) {
      return "High personal satisfaction and positive emotional outlook marked today's entries.";
    }

    return "Every recorded moment is proof of living deliberately. Keep observing your daily trends.";
  },

  /**
   * Generates a multi-item structured feed of actionable insights
   */
  generateComprehensiveInsights(data: InsightInputData): MockInsight[] {
    const { activities, expenses, goals, moods, currency = '₹', filterDate } = data;
    const list: MockInsight[] = [];
    const timestamp = new Date().toISOString();

    const targetActivities = filterDate ? activities.filter(a => a.date === filterDate) : activities;
    const targetExpenses = filterDate ? expenses.filter(e => e.date === filterDate) : expenses;

    // Time analysis
    let totalMinutes = 0;
    let focusMinutes = 0;
    let distractionMinutes = 0;

    targetActivities.forEach(a => {
      totalMinutes += a.durationMinutes;
      if (['Coding', 'Work', 'Study', 'Reading'].includes(a.category)) {
        focusMinutes += a.durationMinutes;
      }
      if (['Social Media', 'Entertainment'].includes(a.category)) {
        distractionMinutes += a.durationMinutes;
      }
    });

    if (focusMinutes > 0) {
      list.push({
        id: generateSafeId('ins'),
        category: 'strength',
        title: 'Deep Work Momentum',
        message: `You spent ${formatMinutesToHoursMinutes(focusMinutes)} on deliberate focus activities. Deep engagement correlates directly with long-term skill acquisition.`,
        impactScore: 92,
        timestamp,
      });
    }

    if (distractionMinutes > 90) {
      list.push({
        id: generateSafeId('ins'),
        category: 'alert',
        title: 'Digital Distraction Notice',
        message: `Social media and entertainment accounted for ${formatMinutesToHoursMinutes(distractionMinutes)}. Swapping 30 minutes of passive browsing for reading or sleep could yield higher energy.`,
        impactScore: 65,
        timestamp,
      });
    }

    // Expense analysis
    const totalSpent = targetExpenses.reduce((acc, e) => acc + e.amount, 0);
    if (totalSpent > 0) {
      list.push({
        id: generateSafeId('ins'),
        category: 'observation',
        title: 'Spending Pattern Tracked',
        message: `Recorded ${targetExpenses.length} expense transactions totaling ${formatCurrency(totalSpent, currency)}. Tracking expenses consciously is the cornerstone of intentional capital allocation.`,
        impactScore: 84,
        timestamp,
      });
    }

    // Goal analysis
    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);
    if (activeGoals.length > 0) {
      list.push({
        id: generateSafeId('ins'),
        category: 'recommendation',
        title: 'Goal Progression',
        message: `You have ${activeGoals.length} active goal${activeGoals.length > 1 ? 's' : ''} in progress and ${completedGoals.length} completed. Consistently executing micro-habits beats irregular bursts of motivation.`,
        impactScore: 88,
        timestamp,
      });
    }

    // Emotional state
    if (moods.length > 0) {
      const avg = moods.reduce((acc, m) => acc + m.rating, 0) / moods.length;
      list.push({
        id: generateSafeId('ins'),
        category: avg >= 7 ? 'strength' : 'observation',
        title: 'Emotional Well-Being Reflection',
        message: avg >= 7 
          ? `Your average mood rating is ${avg.toFixed(1)}/10. High morale boosts problem-solving creativity.`
          : `Your average mood rating is ${avg.toFixed(1)}/10. Prioritize recovery, good hydration, and restorative sleep.`,
        impactScore: Math.round(avg * 10),
        timestamp,
      });
    }

    return list;
  }
};
