import { Activity, Expense, MoodEntry, Goal } from '../types';
import { formatMinutesToHoursMinutes } from '../utils/formatters';

export interface PeriodSummary {
  totalMinutes: number;
  productiveMinutes: number;
  totalExpenses: number;
  averageMood: number;
  activityCount: number;
}

export interface TrendAnalysis {
  productiveHoursDeltaPercent: number;
  totalExpensesDeltaPercent: number;
  moodDelta: number;
  topProductiveCategory: string;
  topProductiveMinutes: number;
  trendHighlights: string[];
  thisWeek: PeriodSummary;
  previousWeek: PeriodSummary;
}

const PRODUCTIVE_CATEGORIES = ['Study', 'Coding', 'Work', 'Exercise', 'Reading'];

/**
 * Calculates percentage change between two values safely.
 * Returns 0 if both are 0, or positive 100 if previous was 0 and current > 0.
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Deterministic Weekly Trend Analysis Engine
 * Analyzes local user data across the current 7-day window vs prior 7-day window.
 * Strictly local heuristic analysis with 0 external API calls.
 */
export const trendService = {
  analyzeWeeklyTrends(params: {
    activities: Activity[];
    expenses: Expense[];
    moods: MoodEntry[];
    goals?: Goal[];
  }): TrendAnalysis {
    const { activities, expenses, moods } = params;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);
    const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().slice(0, 10);

    // Split activities into windows
    const thisWeekActs = activities.filter(a => a.date >= sevenDaysAgoStr);
    const prevWeekActs = activities.filter(a => a.date < sevenDaysAgoStr && a.date >= fourteenDaysAgoStr);

    // Split expenses into windows
    const thisWeekExps = expenses.filter(e => e.date >= sevenDaysAgoStr);
    const prevWeekExps = expenses.filter(e => e.date < sevenDaysAgoStr && e.date >= fourteenDaysAgoStr);

    // Split moods
    const thisWeekMoods = moods.filter(m => m.date >= sevenDaysAgoStr);
    const prevWeekMoods = moods.filter(m => m.date < sevenDaysAgoStr && m.date >= fourteenDaysAgoStr);

    // Sum helper
    const sumMins = (acts: Activity[], filterFn?: (a: Activity) => boolean) =>
      acts.filter(filterFn || (() => true)).reduce((acc, c) => acc + c.durationMinutes, 0);

    const thisProdMins = sumMins(thisWeekActs, a => PRODUCTIVE_CATEGORIES.includes(a.category));
    const prevProdMins = sumMins(prevWeekActs, a => PRODUCTIVE_CATEGORIES.includes(a.category));

    const thisTotalExps = thisWeekExps.reduce((acc, c) => acc + c.amount, 0);
    const prevTotalExps = prevWeekExps.reduce((acc, c) => acc + c.amount, 0);

    const avgMood = (mList: MoodEntry[]) =>
      mList.length > 0 ? +(mList.reduce((acc, c) => acc + c.rating, 0) / mList.length).toFixed(1) : 0;

    const thisAvgMood = avgMood(thisWeekMoods);
    const prevAvgMood = avgMood(prevWeekMoods);

    const prodDelta = calculatePercentageChange(thisProdMins, prevProdMins);
    const expDelta = calculatePercentageChange(thisTotalExps, prevTotalExps);
    const moodDelta = +(thisAvgMood - prevAvgMood).toFixed(1);

    // Find top productive category this week
    const catMap = new Map<string, number>();
    thisWeekActs.forEach(a => {
      catMap.set(a.category, (catMap.get(a.category) || 0) + a.durationMinutes);
    });

    let topCat = 'Focus';
    let topCatMins = 0;
    catMap.forEach((mins, cat) => {
      if (mins > topCatMins) {
        topCatMins = mins;
        topCat = cat;
      }
    });

    // Build human-friendly trend highlights
    const highlights: string[] = [];

    if (prodDelta > 0) {
      highlights.push(`Your productive hours increased by ${prodDelta}% this week.`);
    } else if (prodDelta < 0) {
      highlights.push(`Productive hours decreased by ${Math.abs(prodDelta)}% compared to last week.`);
    } else if (thisProdMins > 0) {
      highlights.push(`You maintained a consistent productive velocity of ${formatMinutesToHoursMinutes(thisProdMins)}.`);
    }

    if (topCatMins > 0) {
      highlights.push(`You spent ${formatMinutesToHoursMinutes(topCatMins)} on ${topCat} this week.`);
    }

    if (expDelta < 0) {
      highlights.push(`Spending decreased by ${Math.abs(expDelta)}% compared to previous period.`);
    } else if (expDelta > 0) {
      highlights.push(`Spending increased by ${expDelta}% this period.`);
    }

    if (moodDelta > 0.3) {
      highlights.push(`Average mood trended +${moodDelta} pts higher this week.`);
    } else if (moodDelta < -0.3) {
      highlights.push(`Average mood was ${Math.abs(moodDelta)} pts lower this week.`);
    }

    if (highlights.length === 0) {
      highlights.push('Logging more daily entries will unlock deeper week-over-week trends.');
    }

    return {
      productiveHoursDeltaPercent: prodDelta,
      totalExpensesDeltaPercent: expDelta,
      moodDelta,
      topProductiveCategory: topCat,
      topProductiveMinutes: topCatMins,
      trendHighlights: highlights,
      thisWeek: {
        totalMinutes: sumMins(thisWeekActs),
        productiveMinutes: thisProdMins,
        totalExpenses: thisTotalExps,
        averageMood: thisAvgMood,
        activityCount: thisWeekActs.length,
      },
      previousWeek: {
        totalMinutes: sumMins(prevWeekActs),
        productiveMinutes: prevProdMins,
        totalExpenses: prevTotalExps,
        averageMood: prevAvgMood,
        activityCount: prevWeekActs.length,
      },
    };
  },
};
