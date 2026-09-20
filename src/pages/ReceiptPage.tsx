import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { LifeReceipt } from '../components/receipt/LifeReceipt';
import { Card } from '../components/common/Card';
import { receiptService } from '../services/receiptService';
import { useLifeData } from '../hooks/useLifeData';

import { AppTheme, ThemeConfig, Language, ActivityCategory, ExpenseCategory } from '../types';
import { ThemeLanguageControl } from '../components/common/ThemeLanguageControl';
import { Button } from '../components/common/Button';
import { triggerConfetti } from '../utils/confetti';

export interface ReceiptPageProps {
  lifeData: ReturnType<typeof useLifeData>;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  themeConfig?: ThemeConfig;
  currentTheme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
  currentLanguage?: Language;
  onSelectLanguage?: (lang: Language) => void;
}

export const ReceiptPage: React.FC<ReceiptPageProps> = ({
  lifeData,
  onShowToast,
  themeConfig,
  currentTheme = 'classic',
  onSelectTheme = () => {},
  currentLanguage = 'en',
  onSelectLanguage = () => {},
}) => {
  const { activities, expenses, goals, moods, profile, addActivity, addExpense, logMood } = lifeData;

  const todayIso = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);

  // Live Quick Edit state
  const [quickType, setQuickType] = useState<'activity' | 'expense'>('activity');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickValue, setQuickValue] = useState('');
  const [liveMood, setLiveMood] = useState<number>(() => {
    const todayMood = moods.find(m => m.date === todayIso);
    return todayMood ? todayMood.rating : 8;
  });

  const receiptData = receiptService.generateReceiptData({
    activities,
    expenses,
    goals,
    moods,
    profile,
    filterDate: selectedDate || undefined,
  });

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickValue) {
      onShowToast('Missing Information', 'Please enter a description and number.', 'warning');
      return;
    }

    const numVal = parseFloat(quickValue);
    if (isNaN(numVal) || numVal <= 0) {
      onShowToast('Invalid Number', 'Please enter a positive value.', 'error');
      return;
    }

    try {
      if (quickType === 'activity') {
        addActivity({
          title: quickTitle.trim(),
          category: 'Coding' as ActivityCategory,
          durationMinutes: Math.min(1440, Math.round(numVal)),
          date: selectedDate || todayIso,
        });
        onShowToast('Activity Added!', `"${quickTitle}" added to today's receipt ticket.`, 'success');
      } else {
        addExpense({
          description: quickTitle.trim(),
          category: 'Food' as ExpenseCategory,
          amount: Math.min(1000000, numVal),
          date: selectedDate || todayIso,
        });
        onShowToast('Expense Logged!', `"${quickTitle}" appended to finances.`, 'success');
      }

      setQuickTitle('');
      setQuickValue('');

      if (receiptData.lifeScoreBreakdown.finalScore >= 75) {
        triggerConfetti(2500);
      }
    } catch (err: any) {
      onShowToast('Error', err.message || 'Failed to add item', 'error');
    }
  };

  const handleMoodSliderChange = (newRating: number) => {
    setLiveMood(newRating);
    logMood(newRating, undefined, selectedDate || todayIso);
    if (newRating >= 9) {
      triggerConfetti(1500);
    }
  };

  return (
    <PageContainer
      title="Your Life Receipt"
      subtitle="A tangible, itemized ledger of what you gave your time, energy, and capital to."
      action={
        <div className="no-print flex items-center gap-2.5 flex-wrap">
          <ThemeLanguageControl
            currentTheme={currentTheme}
            onSelectTheme={onSelectTheme}
            currentLanguage={currentLanguage}
            onSelectLanguage={onSelectLanguage}
            variant="compact"
          />
          <label htmlFor="receipt-date-filter" className="text-xs text-neutral-400 font-medium sr-only">
            Filter Receipt Date
          </label>
          <input
            id="receipt-date-filter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 font-mono min-h-[44px]"
          />
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center: Thermal Receipt */}
        <div className="lg:col-span-7 flex justify-center">
          <LifeReceipt
            receiptData={receiptData}
            themeConfig={themeConfig}
            language={currentLanguage}
            onCopySuccess={() =>
              onShowToast('Receipt Copied!', 'Monospace text format copied to clipboard.', 'success')
            }
          />
        </div>

        {/* Right: Technical Receipt Specifications & Score Audit */}
        <div className="lg:col-span-5 space-y-6 no-print">
          {/* Live Quick-Entry Card */}
          <Card variant="elevated">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <span className="text-amber-400">⚡</span>
                <span>Live Receipt Quick-Entry</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Instant Update
              </span>
            </div>

            <p className="text-xs text-neutral-400 mb-4">
              Add transactions or tweak your mood. The thermal docket on the left updates dynamically in real time.
            </p>

            {/* Quick Mood Slider */}
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <span>{liveMood >= 8 ? '😊' : liveMood >= 5 ? '😐' : '😔'}</span>
                  <span>Today's Vibe Rating</span>
                </span>
                <span className="font-mono font-bold text-amber-400">{liveMood} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={liveMood}
                onChange={(e) => handleMoodSliderChange(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-700 rounded-lg"
                aria-label="Adjust today's vibe rating"
              />
            </div>

            {/* Quick Line Item Add */}
            <form onSubmit={handleQuickAdd} className="space-y-3" noValidate>
              <div className="flex items-center gap-2 p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setQuickType('activity')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                    quickType === 'activity'
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  ⏱️ + Activity
                </button>
                <button
                  type="button"
                  onClick={() => setQuickType('expense')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                    quickType === 'expense'
                      ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  💳 + Expense
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={quickType === 'activity' ? 'e.g. Deep Coding' : 'e.g. Organic Coffee'}
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-neutral-800/80 border border-neutral-700 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="Item title or description"
                />
                <input
                  type="number"
                  placeholder={quickType === 'activity' ? 'Minutes (e.g. 45)' : 'Amount (e.g. 180)'}
                  value={quickValue}
                  onChange={(e) => setQuickValue(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-neutral-800/80 border border-neutral-700 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 font-mono"
                  aria-label="Duration in minutes or expense amount"
                />
              </div>

              <Button variant="outline" size="sm" type="submit" className="w-full justify-center">
                + Append to Receipt Docket
              </Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-base font-bold text-neutral-100 mb-2 flex items-center gap-2">
              <span>🔍</span>
              <span>Receipt Audit & Verification</span>
            </h2>
            <div className="space-y-3 text-xs text-neutral-300">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Ledger Identifier</span>
                <span className="font-mono text-neutral-200">{receiptData.receiptId}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Customer Name</span>
                <span className="font-medium text-neutral-200">{receiptData.userName}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Total Hours Tracked</span>
                <span className="font-mono text-amber-400 font-bold">{receiptData.totalTimeFormatted}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Total Money Outflow</span>
                <span className="font-mono text-emerald-400 font-bold">{receiptData.totalExpensesFormatted}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Life Index Score</span>
                <span className="font-mono text-amber-300 font-bold">{receiptData.lifeScoreBreakdown.finalScore}/100</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
              <p className="font-bold text-neutral-300">Deterministic Computation Note:</p>
              <p>
                Calculations are strictly conducted client-side on your local browser. No data ever leaves your device or touches an external server.
              </p>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-bold text-neutral-100 mb-2 flex items-center gap-2">
              <span>🖨️</span>
              <span>Printing Tips</span>
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Press the <strong>Print Receipt</strong> button to output directly to standard 80mm thermal receipt printers, or save as an authentic PDF docket with headers and buttons stripped automatically.
            </p>
            <div className="text-[11px] font-mono text-neutral-500">
              Tested for Chrome, Firefox, Edge, and Safari print engines.
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
