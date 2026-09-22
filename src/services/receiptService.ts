import { Activity, Expense, Goal, MoodEntry, UserProfile, LifeReceiptData } from '../types';
import { groupTimeByCategory, groupExpensesByCategory, calculateTotalExpenses, calculateTotalTime, calculateLifeScore, calculateMoodAverage } from '../utils/calculations';
import { formatMinutesToHoursMinutes, formatCurrency, formatReceiptDate, formatDotLeaderText } from '../utils/formatters';
import { insightService } from './insightService';

export interface GenerateReceiptParams {
  activities: Activity[];
  expenses: Expense[];
  goals: Goal[];
  moods: MoodEntry[];
  profile: UserProfile;
  filterDate?: string;
}

/**
 * Service responsible for synthesizing local data into a complete LifeReceiptData model
 * and generating formatted plain text receipts for copying or printing.
 */
export const receiptService = {
  generateReceiptData(params: GenerateReceiptParams): LifeReceiptData {
    const { activities, expenses, goals, moods, profile, filterDate } = params;

    const timeSpentByCategory = groupTimeByCategory(activities, filterDate);
    const totalTimeMinutes = calculateTotalTime(activities, filterDate);
    const totalTimeFormatted = formatMinutesToHoursMinutes(totalTimeMinutes);

    const expensesByCategory = groupExpensesByCategory(expenses, profile.currency, filterDate);
    const totalExpenses = calculateTotalExpenses(expenses, filterDate);
    const totalExpensesFormatted = formatCurrency(totalExpenses, profile.currency);

    const completedAchievements = goals.filter(g => g.completed).map(g => g.title);
    const inProgressGoals = goals.filter(g => !g.completed).map(g => ({
      title: g.title,
      progress: g.progress,
    }));

    const { average: averageMood } = calculateMoodAverage(moods, filterDate);
    const lifeScoreBreakdown = calculateLifeScore({ activities, goals, moods, filterDate });

    const aiInsight = insightService.generateReceiptInsight({
      activities,
      expenses,
      goals,
      moods,
      currency: profile.currency,
      filterDate,
    });

    // Deterministic receipt ID based on date and time
    const datePart = filterDate ? filterDate.replace(/-/g, '') : new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const receiptId = `RCPT-${datePart}-${Math.abs((totalExpenses + totalTimeMinutes + lifeScoreBreakdown.finalScore) % 9999).toString().padStart(4, '0')}`;
    const barcodeValue = `*${receiptId}*`;

    // Compute count metrics and highlight
    const filteredActivities = filterDate ? activities.filter(a => a.date === filterDate) : activities;
    const activitiesCount = filteredActivities.length;
    const completedGoalsCount = completedAchievements.length;

    let todayHighlight = 'Documented daily living and disciplined execution.';
    if (completedAchievements.length > 0) {
      todayHighlight = `Completed milestone: "${completedAchievements[0]}".`;
    } else if (filteredActivities.length > 0) {
      const topAct = [...filteredActivities].sort((a, b) => b.durationMinutes - a.durationMinutes)[0];
      todayHighlight = `Invested ${formatMinutesToHoursMinutes(topAct.durationMinutes)} in "${topAct.title}".`;
    }

    return {
      receiptId,
      dateFormatted: formatReceiptDate(filterDate),
      userName: profile.name,
      currency: profile.currency,
      timeSpentByCategory,
      totalTimeMinutes,
      totalTimeFormatted,
      expensesByCategory,
      totalExpenses,
      totalExpensesFormatted,
      completedAchievements,
      inProgressGoals,
      averageMood,
      lifeScoreBreakdown,
      aiInsight,
      barcodeValue,
      activitiesCount,
      completedGoalsCount,
      todayHighlight,
    };
  },

  /**
   * Generates authentic monospace plain text version of the receipt
   */
  generatePlainTextReceipt(data: LifeReceiptData): string {
    const divider = '========================================';
    const subDivider = '----------------------------------------';
    const lines: string[] = [];

    lines.push(divider);
    lines.push('           YOUR LIFE RECEIPT            ');
    lines.push('      TRANSACTIONS OF DAILY LIFE        ');
    lines.push(divider);
    lines.push(`RECEIPT ID : ${data.receiptId}`);
    lines.push(`DATE       : ${data.dateFormatted}`);
    lines.push(`CUSTOMER   : ${data.userName}`);
    lines.push(subDivider);

    lines.push('TIME SPENT:');
    if (data.timeSpentByCategory.length > 0) {
      data.timeSpentByCategory.forEach(item => {
        lines.push(formatDotLeaderText(item.category, item.formatted, 38));
      });
      lines.push(formatDotLeaderText('TOTAL TIME', data.totalTimeFormatted, 38));
    } else {
      lines.push('  No tracked activities recorded.');
    }
    lines.push(subDivider);

    lines.push('MONEY SPENT:');
    if (data.expensesByCategory.length > 0) {
      data.expensesByCategory.forEach(item => {
        lines.push(formatDotLeaderText(item.category, item.formatted, 38));
      });
      lines.push(formatDotLeaderText('TOTAL EXPENSES', data.totalExpensesFormatted, 38));
    } else {
      lines.push('  No expenses recorded for this period.');
    }
    lines.push(subDivider);

    if (data.completedAchievements.length > 0) {
      lines.push('ACHIEVEMENTS COMPLETED:');
      data.completedAchievements.forEach(ach => {
        lines.push(` [✓] ${ach}`);
      });
      lines.push(subDivider);
    }

    if (data.averageMood !== null) {
      const moodEmoji = data.averageMood >= 8 ? '😊' : data.averageMood >= 5 ? '😐' : '😔';
      lines.push(`MOOD RATING : ${moodEmoji} ${data.averageMood}/10`);
      lines.push(subDivider);
    }

    lines.push(`LIFE SCORE  : ${data.lifeScoreBreakdown.finalScore}/100`);
    lines.push(`STATUS      : ${data.lifeScoreBreakdown.explanation}`);
    lines.push(subDivider);

    lines.push('AI REFLECTION:');
    lines.push(`"${data.aiInsight}"`);
    lines.push(subDivider);

    lines.push('         THANK YOU FOR LIVING.          ');
    lines.push('    YOUR EXISTENCE HAS VALUE & WEIGHT   ');
    lines.push(divider);

    return lines.join('\n');
  }
};
