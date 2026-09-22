import React, { useState } from 'react';
import { LifeScoreBreakdown } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { TranslationKey } from '../../i18n/translations';

export interface ScoreOverviewProps {
  scoreData: LifeScoreBreakdown;
  t?: (key: TranslationKey) => string;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({ scoreData, t }) => {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const getLabel = (key: TranslationKey, fallback: string) => (t ? t(key) : fallback);

  const subMetrics = [
    { label: getLabel('productivity', 'Productivity'), value: scoreData.productivity, weight: '30%', color: 'text-amber-400', desc: 'Ratio of constructive focus time (Coding, Study, Work, Reading) against passive distractions.' },
    { label: getLabel('health', 'Health & Habits'), value: scoreData.health, weight: '20%', color: 'text-emerald-400', desc: 'Physical exercise duration and adequate sleep balance.' },
    { label: getLabel('mood', 'Mood & Morale'), value: scoreData.mood, weight: '20%', color: 'text-blue-400', desc: 'Normalized average of emotional check-in ratings (Rating × 10).' },
    { label: getLabel('goalsProgress', 'Goal Progress'), value: scoreData.goals, weight: '20%', color: 'text-purple-400', desc: 'Proportion of active goals completed or progressing steadily.' },
    { label: getLabel('balance', 'Daily Balance'), value: scoreData.balance, weight: '10%', color: 'text-rose-400', desc: 'Variance penalty ensuring waking hours are not dominated by single extreme activities.' },
  ];

  return (
    <Card className="relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Score Badge */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <span>⚡ Transparent Daily Metric</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">
            {getLabel('lifeScoreTitle', 'Life Score Index')}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mt-1">
            {scoreData.explanation}
          </p>

          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl sm:text-5xl font-black font-mono text-neutral-100 tracking-tight">
              {scoreData.finalScore}
            </span>
            <span className="text-sm font-semibold text-neutral-400 font-mono">
              / 100
            </span>
          </div>

          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBreakdownOpen(true)}
              aria-label="View transparent Life Score calculation breakdown"
            >
              📊 View breakdown
            </Button>
          </div>
        </div>

        {/* Right: Sub-factor Breakdown */}
        <div className="w-full md:w-auto flex-1 max-w-md space-y-2.5 bg-neutral-950/40 p-4 rounded-xl border border-neutral-800">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
            {getLabel('calculationBreakdown', 'Calculation Breakdown')}
          </h3>
          {subMetrics.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <span>{item.label}</span>
                <span className="text-[10px] text-neutral-500 font-mono">({item.weight})</span>
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-neutral-800 h-1.5 rounded-full overflow-hidden" aria-hidden="true">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className={`font-mono font-bold w-7 text-right ${item.color}`}>
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Disclaimer */}
      <div className="mt-4 pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between flex-wrap gap-2">
        <span>* Deterministic formula: Productivity (30%) + Health (20%) + Mood (20%) + Goals (20%) + Balance (10%).</span>
        <button
          type="button"
          onClick={() => setIsBreakdownOpen(true)}
          className="text-amber-400 hover:underline font-medium text-xs focus:outline-none"
        >
          Detailed formula →
        </button>
      </div>

      {/* Accessible Breakdown Modal */}
      <Modal
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        title="Life Score Index: Mathematical Breakdown"
      >
        <div className="space-y-4 text-xs sm:text-sm text-neutral-300">
          <p className="leading-relaxed">
            Your Life Score Index is calculated dynamically out of 100 based on five transparent, privacy-first parameters evaluated directly in your browser:
          </p>

          <div className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800 font-mono text-xs text-amber-300 overflow-x-auto">
            Score = (P × 0.30) + (H × 0.20) + (M × 0.20) + (G × 0.20) + (B × 0.10)
          </div>

          <div className="space-y-3 divide-y divide-neutral-800/60 pt-1">
            {subMetrics.map((item) => (
              <div key={item.label} className="pt-2.5 first:pt-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-100 flex items-center gap-1.5">
                    <span>{item.label}</span>
                    <span className="text-neutral-500 font-mono text-xs font-normal">({item.weight})</span>
                  </span>
                  <span className={`font-mono font-bold ${item.color}`}>{item.value} / 100</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setIsBreakdownOpen(false)}>
              Close Breakdown
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
