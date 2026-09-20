import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LANGUAGES, getTranslation } from '../i18n/translations';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { LifeReceipt } from '../components/receipt/LifeReceipt';
import { SEED_ACTIVITIES, SEED_EXPENSES, SEED_GOALS, SEED_MOODS, SEED_PROFILE } from '../data/initialSeedData';
import { receiptService } from '../services/receiptService';

describe('Multi-Language & i18n System', () => {
  it('supports English, Hindi, and Marathi in LANGUAGES constant', () => {
    expect(LANGUAGES).toHaveLength(3);
    const codes = LANGUAGES.map(l => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('mr');

    const hindi = LANGUAGES.find(l => l.code === 'hi');
    expect(hindi?.nativeName).toBe('हिन्दी');

    const marathi = LANGUAGES.find(l => l.code === 'mr');
    expect(marathi?.nativeName).toBe('मराठी');
  });

  it('translates core navigation and receipt keys for all supported languages', () => {
    // English
    expect(getTranslation('en', 'receiptTitle')).toBe('YOUR LIFE RECEIPT');
    expect(getTranslation('en', 'navDashboard')).toBe('Dashboard');

    // Hindi
    expect(getTranslation('hi', 'receiptTitle')).toBe('आपकी जीवन रसीद');
    expect(getTranslation('hi', 'navDashboard')).toBe('डैशबोर्ड');
    expect(getTranslation('hi', 'receiptTimeSpent')).toBe('बिताया गया समय');
    expect(getTranslation('hi', 'receiptMoneySpent')).toBe('खर्च किया गया धन');

    // Marathi
    expect(getTranslation('mr', 'receiptTitle')).toBe('तुमची जीवन पावती');
    expect(getTranslation('mr', 'navDashboard')).toBe('डॅशबोर्ड');
    expect(getTranslation('mr', 'receiptTimeSpent')).toBe('दिलेला वेळ');
    expect(getTranslation('mr', 'receiptMoneySpent')).toBe('झालेला खर्च');
  });

  it('falls back safely to English or key when a translation is missing', () => {
    // Missing key in existing language falls back to English or key
    const fallbackVal = getTranslation('hi', 'nonExistentKey' as any);
    expect(fallbackVal).toBe('nonExistentKey');
  });

  it('renders LanguageSelector and triggers callback when changing language', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <LanguageSelector
        currentLanguage="en"
        onSelectLanguage={handleSelect}
      />
    );

    const trigger = screen.getByRole('button', { name: /Click to change language/i });
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    const hindiItem = screen.getByRole('menuitemradio', { name: /हिन्दी/i });
    expect(hindiItem).toBeInTheDocument();

    await user.click(hindiItem);
    expect(handleSelect).toHaveBeenCalledWith('hi');
  });

  it('renders LifeReceipt in Hindi and Marathi properly', () => {
    const receiptData = receiptService.generateReceiptData({
      activities: SEED_ACTIVITIES,
      expenses: SEED_EXPENSES,
      goals: SEED_GOALS,
      moods: SEED_MOODS,
      profile: SEED_PROFILE,
      filterDate: '2026-09-20',
    });

    // Render Hindi
    const { unmount: unmountHi } = render(
      <LifeReceipt receiptData={receiptData} language="hi" />
    );
    expect(screen.getByText('आपकी जीवन रसीद')).toBeInTheDocument();
    expect(screen.getByText('बिताया गया समय')).toBeInTheDocument();
    expect(screen.getByText('खर्च किया गया धन')).toBeInTheDocument();
    unmountHi();

    // Render Marathi
    render(
      <LifeReceipt receiptData={receiptData} language="mr" />
    );
    expect(screen.getByText('तुमची जीवन पावती')).toBeInTheDocument();
    expect(screen.getByText('दिलेला वेळ')).toBeInTheDocument();
    expect(screen.getByText('झालेला खर्च')).toBeInTheDocument();
  });
});
