import React, { useState } from 'react';
import { LifeReceiptData, ThemeConfig, Language } from '../../types';
import { DotLeaderItem } from './DotLeaderItem';
import { ReceiptSection } from './ReceiptSection';
import { Barcode } from './Barcode';
import { Button } from '../common/Button';
import { receiptService } from '../../services/receiptService';
import { THEMES } from '../../constants';
import { getTranslation, TranslationKey } from '../../i18n/translations';

export interface LifeReceiptProps {
  receiptData: LifeReceiptData;
  onCopySuccess?: () => void;
  themeConfig?: ThemeConfig;
  language?: Language;
}

export const LifeReceipt: React.FC<LifeReceiptProps> = ({
  receiptData,
  onCopySuccess,
  themeConfig,
  language = 'en',
}) => {
  const [copied, setCopied] = useState(false);
  const activeTheme = themeConfig || THEMES[0];

  const loc = (key: TranslationKey, fallback: string) => getTranslation(language, key) || fallback;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = () => {
    const plainText = receiptService.generatePlainTextReceipt(receiptData);
    const lines = plainText.split('\n');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lineHeight = 20;
    const padding = 28;
    const width = 450;
    const height = lines.length * lineHeight + padding * 2;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = activeTheme.receiptBg || '#faf8f5';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = activeTheme.receiptBorder || '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // Text
    ctx.fillStyle = activeTheme.receiptText || '#1f1e1d';
    ctx.font = '13px "Courier New", Courier, monospace';
    ctx.textBaseline = 'top';

    lines.forEach((line, index) => {
      ctx.fillText(line, padding, padding + index * lineHeight);
    });

    const link = document.createElement('a');
    link.download = `life-receipt-${receiptData.receiptId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyText = async () => {
    const plainText = receiptService.generatePlainTextReceipt(receiptData);
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const moodEmoji = receiptData.averageMood !== null 
    ? receiptData.averageMood >= 8 
      ? '😊' 
      : receiptData.averageMood >= 5 
        ? '😐' 
        : '😔'
    : '⚖️';

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Top Action Controls (Hidden on print) */}
      <div className="no-print flex items-center justify-between w-full mb-4 px-2 gap-2 flex-wrap">
        <span className="text-xs text-neutral-400 font-mono">
          ID: {receiptData.receiptId}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyText}
            aria-label={copied ? loc('receiptCopied', '✓ Copied') : loc('receiptCopy', 'Copy Text')}
            title="Copy monospace text"
          >
            {copied ? loc('receiptCopied', '✓ Copied') : loc('receiptCopy', 'Copy Text')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadImage}
            aria-label={loc('receiptDownloadImage', 'Download Image')}
            title="Download crisp PNG image docket"
          >
            <span>🖼️</span>
            <span className="hidden sm:inline ml-1">{loc('receiptDownloadImage', 'Download Image')}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            aria-label={loc('receiptPrint', 'Print / PDF')}
            title="Print or Save as authentic PDF docket"
          >
            <span>📄</span>
            <span className="ml-1">{loc('receiptPrint', 'Print / PDF')}</span>
          </Button>
        </div>
      </div>

      {/* Main Thermal Receipt Container */}
      <article
        className="receipt-container w-full font-mono shadow-receipt-lg transition-all rounded-sm overflow-hidden relative border"
        style={{
          backgroundColor: activeTheme.receiptBg,
          color: activeTheme.receiptText,
          borderColor: activeTheme.receiptBorder,
          '--receipt-paper-color': activeTheme.receiptBg,
        } as React.CSSProperties}
        aria-label={loc('receiptTitle', 'YOUR LIFE RECEIPT')}
      >
        {/* Jagged paper tear top */}
        <div className="receipt-tear-top" aria-hidden="true" />

        <div className="p-6 sm:p-8 space-y-4">
          {/* Header */}
          <header className="text-center border-b-2 border-current pb-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              {loc('receiptTitle', 'YOUR LIFE RECEIPT')}
            </h1>
            <p className="text-[11px] opacity-80 mt-0.5 tracking-wider uppercase">
              {loc('receiptSubtitle', 'Transactions of Living & Growth')}
            </p>
            <div className="mt-2 text-xs flex justify-between font-mono font-medium opacity-90">
              <span>DATE: {receiptData.dateFormatted}</span>
              <span>TIME: 23:59</span>
            </div>
            <div className="text-xs text-left font-mono font-medium opacity-90 mt-0.5">
              <span>USER: {receiptData.userName}</span>
            </div>
          </header>

          {/* Time Spent Section */}
          <ReceiptSection title={loc('receiptTimeSpent', 'TIME SPENT')}>
            {receiptData.timeSpentByCategory.length > 0 ? (
              <>
                {receiptData.timeSpentByCategory.map((item) => (
                  <DotLeaderItem
                    key={item.category}
                    label={item.category}
                    value={item.formatted}
                  />
                ))}
                <div className="pt-1 border-t border-neutral-300 mt-1">
                  <DotLeaderItem
                    label={loc('receiptTotalTime', 'TOTAL TIME')}
                    value={receiptData.totalTimeFormatted}
                    isBold
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-neutral-500 italic py-1">{loc('receiptNoActivities', 'No tracked activities today.')}</p>
            )}
          </ReceiptSection>

          {/* Money Spent Section */}
          <ReceiptSection title={loc('receiptMoneySpent', 'MONEY SPENT')}>
            {receiptData.expensesByCategory.length > 0 ? (
              <>
                {receiptData.expensesByCategory.map((item) => (
                  <DotLeaderItem
                    key={item.category}
                    label={item.category}
                    value={item.formatted}
                  />
                ))}
                <div className="pt-1 border-t border-neutral-300 mt-1">
                  <DotLeaderItem
                    label={loc('receiptTotal', 'TOTAL')}
                    value={receiptData.totalExpensesFormatted}
                    isBold
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-neutral-500 italic py-1">{loc('receiptNoExpenses', 'No expenses recorded today.')}</p>
            )}
          </ReceiptSection>

          {/* Achievements / Goals Section */}
          {(receiptData.completedAchievements.length > 0 || receiptData.inProgressGoals.length > 0) && (
            <ReceiptSection title={loc('receiptAchievements', 'ACHIEVEMENTS & GOALS')}>
              {receiptData.completedAchievements.map((ach, idx) => (
                <div key={idx} className="flex items-baseline gap-2 text-xs py-0.5 font-medium">
                  <span className="text-neutral-900 font-bold" aria-hidden="true">✓</span>
                  <span>{ach}</span>
                </div>
              ))}
              {receiptData.inProgressGoals.slice(0, 2).map((goal, idx) => (
                <DotLeaderItem
                  key={`prog_${idx}`}
                  label={goal.title}
                  value={`${goal.progress}%`}
                  subLabel={loc('inProgress', 'in progress')}
                />
              ))}
            </ReceiptSection>
          )}

          {/* Mood Section */}
          {receiptData.averageMood !== null && (
            <ReceiptSection title={loc('receiptMood', 'MOOD')}>
              <div className="flex items-center justify-between text-xs sm:text-sm py-0.5">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">{moodEmoji}</span>
                  <span className="font-semibold">{loc('receiptAverageVibe', 'Average Vibe:')}</span>
                </span>
                <span className="font-bold font-mono">{receiptData.averageMood}/10</span>
              </div>
            </ReceiptSection>
          )}

          {/* Life Score Section */}
          <ReceiptSection title={loc('receiptLifeScore', 'LIFE SCORE')}>
            <div className="flex items-center justify-between text-sm sm:text-base py-1 font-bold">
              <span>{loc('receiptOverallIndex', 'OVERALL INDEX')}</span>
              <span className="text-lg font-black font-mono">
                {receiptData.lifeScoreBreakdown.finalScore}/100
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-snug mt-0.5">
              {receiptData.lifeScoreBreakdown.explanation}
            </p>
          </ReceiptSection>

          {/* AI-Style Insight */}
          <div
            className="my-3 p-3 rounded border text-current"
            style={{
              borderColor: activeTheme.receiptBorder,
              backgroundColor: 'rgba(128, 128, 128, 0.07)',
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75 mb-1">
              {loc('receiptReflection', 'Deterministic Daily Reflection')}
            </span>
            <p className="text-xs leading-relaxed italic">
              "{receiptData.aiInsight}"
            </p>
          </div>

          {/* Barcode & Footer */}
          <footer className="pt-2 border-t-2 border-current text-center">
            <Barcode value={receiptData.barcodeValue} />
            <div className="mt-2 text-xs font-bold uppercase tracking-widest opacity-90">
              {loc('receiptThankYou', 'THANK YOU FOR LIVING.')}
            </div>
            <p className="text-[10px] opacity-75 uppercase tracking-wider mt-0.5">
              {loc('receiptFooterSub', 'Retain receipt for your personal records')}
            </p>
          </footer>
        </div>

        {/* Jagged paper tear bottom */}
        <div className="receipt-tear-bottom" aria-hidden="true" />
      </article>
    </div>
  );
};
