import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ActivityForm } from '../components/activities/ActivityForm';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { GoalForm } from '../components/goals/GoalForm';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useLifeData } from '../hooks/useLifeData';

export interface AddEntryProps {
  lifeData: ReturnType<typeof useLifeData>;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

type TabType = 'activity' | 'expense' | 'goal' | 'mood';

export const AddEntryPage: React.FC<AddEntryProps> = ({ lifeData, onShowToast }) => {
  const { addActivity, addExpense, addGoal, logMood, profile } = lifeData;
  const [activeTab, setActiveTab] = useState<TabType>('activity');

  // Mood form local state
  const [moodRating, setMoodRating] = useState<number>(8);
  const [moodNote, setMoodNote] = useState('');

  const handleActivitySubmit = (data: Parameters<typeof addActivity>[0]) => {
    try {
      addActivity(data);
      onShowToast('Activity Recorded!', `${data.title} (${data.durationMinutes} min) added to receipt.`, 'success');
    } catch (err: any) {
      onShowToast('Failed to add activity', err.message, 'error');
    }
  };

  const handleExpenseSubmit = (data: Parameters<typeof addExpense>[0]) => {
    try {
      addExpense(data);
      onShowToast('Expense Logged!', `${profile.currency}${data.amount} for ${data.description}`, 'success');
    } catch (err: any) {
      onShowToast('Failed to add expense', err.message, 'error');
    }
  };

  const handleGoalSubmit = (data: Parameters<typeof addGoal>[0]) => {
    try {
      addGoal(data);
      onShowToast('Goal Saved!', `${data.title} added to your active targets.`, 'success');
    } catch (err: any) {
      onShowToast('Failed to save goal', err.message, 'error');
    }
  };

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      logMood(moodRating, moodNote);
      onShowToast('Mood Logged!', `Recorded vibe: ${moodRating}/10`, 'success');
      setMoodNote('');
    } catch (err: any) {
      onShowToast('Failed to log mood', err.message, 'error');
    }
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'activity', label: 'Activity', icon: '⏱️' },
    { id: 'expense', label: 'Expense', icon: '💳' },
    { id: 'goal', label: 'Goal', icon: '🎯' },
    { id: 'mood', label: 'Mood / Vibe', icon: '😊' },
  ];

  return (
    <PageContainer
      title="Add to Your Ledger"
      subtitle="Log activities, record expenses, define goals, or check in on your emotional vibe."
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Accessible Tab Navigation */}
        <div
          role="tablist"
          aria-label="Add entry categories"
          className="flex rounded-xl bg-neutral-900 border border-neutral-800 p-1 gap-1"
        >
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-controls={`panel-${tab.id}`}
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[44px] flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                }`}
              >
                <span aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        <Card variant="elevated">
          {activeTab === 'activity' && (
            <div role="tabpanel" id="panel-activity" aria-labelledby="tab-activity">
              <h2 className="text-base font-bold text-neutral-100 mb-4 flex items-center gap-2">
                <span>⏱️</span>
                <span>Log Tracked Activity</span>
              </h2>
              <ActivityForm onSubmit={handleActivitySubmit} />
            </div>
          )}

          {activeTab === 'expense' && (
            <div role="tabpanel" id="panel-expense" aria-labelledby="tab-expense">
              <h2 className="text-base font-bold text-neutral-100 mb-4 flex items-center gap-2">
                <span>💳</span>
                <span>Log Financial Expense</span>
              </h2>
              <ExpenseForm currency={profile.currency} onSubmit={handleExpenseSubmit} />
            </div>
          )}

          {activeTab === 'goal' && (
            <div role="tabpanel" id="panel-goal" aria-labelledby="tab-goal">
              <h2 className="text-base font-bold text-neutral-100 mb-4 flex items-center gap-2">
                <span>🎯</span>
                <span>Set Compounding Goal</span>
              </h2>
              <GoalForm onSubmit={handleGoalSubmit} />
            </div>
          )}

          {activeTab === 'mood' && (
            <div role="tabpanel" id="panel-mood" aria-labelledby="tab-mood">
              <h2 className="text-base font-bold text-neutral-100 mb-4 flex items-center gap-2">
                <span>😊</span>
                <span>Daily Emotional Check-in</span>
              </h2>
              <form onSubmit={handleMoodSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline text-sm">
                    <label htmlFor="mood-slider" className="font-medium text-neutral-200">
                      How energized and grounded do you feel today?
                    </label>
                    <span className="font-mono text-xl font-bold text-amber-400">
                      {moodRating} / 10
                    </span>
                  </div>

                  <input
                    id="mood-slider"
                    type="range"
                    min="1"
                    max="10"
                    value={moodRating}
                    onChange={(e) => setMoodRating(Number(e.target.value))}
                    aria-label="Mood rating from 1 to 10"
                    className="w-full accent-amber-500 cursor-pointer h-8"
                  />

                  <div className="flex justify-between text-[11px] text-neutral-400 font-mono" aria-hidden="true">
                    <span>1 (Drained)</span>
                    <span>5 (Balanced)</span>
                    <span>10 (Peak Flow)</span>
                  </div>
                </div>

                <Input
                  id="mood-note"
                  label="Reflection Note (Optional)"
                  placeholder="e.g. Cleared difficult algorithm challenges and felt great mental clarity."
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                />

                <div className="flex justify-end pt-3 border-t border-neutral-800">
                  <Button variant="primary" size="md" type="submit">
                    Save Mood Check-in
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};
