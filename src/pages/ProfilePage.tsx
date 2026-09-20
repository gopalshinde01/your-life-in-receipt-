import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { CURRENCIES } from '../constants';
import { useLifeData } from '../hooks/useLifeData';
import { AppTheme, Language } from '../types';
import { ThemeLanguageControl } from '../components/common/ThemeLanguageControl';

export interface ProfilePageProps {
  lifeData: ReturnType<typeof useLifeData>;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  currentTheme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
  currentLanguage?: Language;
  onSelectLanguage?: (lang: Language) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  lifeData,
  onShowToast,
  currentTheme = 'classic',
  onSelectTheme = () => {},
  currentLanguage = 'en',
  onSelectLanguage = () => {},
}) => {
  const { profile, updateProfile, resetToSeedData, clearAllData } = lifeData;

  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline || '');
  const [currency, setCurrency] = useState(profile.currency);
  const [philosophy, setPhilosophy] = useState(profile.lifePhilosophy || '');

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      headline,
      currency,
      lifePhilosophy: philosophy,
    });
    onShowToast('Profile Updated', 'Your changes have been saved to local storage.', 'success');
  };

  const handleResetData = () => {
    resetToSeedData();
    setName('Gopal Shinde');
    setCurrency('₹');
    onShowToast('Data Restored', 'Reset to initial sample evaluation dataset.', 'success');
  };

  const handleConfirmClear = () => {
    clearAllData();
    setConfirmClearOpen(false);
    onShowToast('Ledger Cleared', 'All local activities and expenses have been cleared.', 'info');
  };

  const currencyOptions = CURRENCIES.map(c => ({
    value: c.symbol,
    label: `${c.symbol} (${c.code} - ${c.name})`,
  }));

  return (
    <PageContainer
      title="Profile & Ledger Preferences"
      subtitle="Customize how your Life Receipt is branded and manage your local data."
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Profile Settings Card */}
        <Card variant="elevated">
          <form onSubmit={handleSaveProfile} className="space-y-4" noValidate>
            <h2 className="text-base font-bold text-neutral-100 mb-2 flex items-center gap-2">
              <span>👤</span>
              <span>Personal Identity</span>
            </h2>

            <Input
              id="profile-name"
              label="Customer / Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="Appears on the Life Receipt header"
              required
            />

            <Input
              id="profile-headline"
              label="Bio / Title"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Full-Stack Craftsman & Lifelong Learner"
            />

            <Select
              id="profile-currency"
              label="Default Currency Symbol"
              options={currencyOptions}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-philosophy" className="text-sm font-medium text-neutral-200">
                Personal Life Motto
              </label>
              <textarea
                id="profile-philosophy"
                rows={2}
                value={philosophy}
                onChange={(e) => setPhilosophy(e.target.value)}
                placeholder="A quote or guiding principle for living..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 text-sm"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-800">
              <Button variant="primary" size="md" type="submit">
                Save Preferences
              </Button>
            </div>
          </form>
        </Card>

        {/* Merged Theme & Language Preferences Card */}
        <Card variant="elevated">
          <div className="mb-6">
            <h2 className="text-base font-bold text-neutral-100 flex items-center gap-2">
              <span>🎨</span>
              <span>Display & Language Preferences</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Configure your preferred visual appearance (Pure White or Classic Thermal) and regional interface language in sequence. Changes apply instantly across the entire website and receipt docket.
            </p>
          </div>

          <ThemeLanguageControl
            currentTheme={currentTheme}
            onSelectTheme={(th) => {
              onSelectTheme(th);
              onShowToast('Theme Updated', `Switched theme to ${th === 'classic' ? 'Classic Thermal' : 'Pure White'}.`, 'success');
            }}
            currentLanguage={currentLanguage}
            onSelectLanguage={(lang) => {
              onSelectLanguage(lang);
              onShowToast('Language Updated', `Switched interface language to ${lang.toUpperCase()}.`, 'success');
            }}
            variant="expanded"
          />
        </Card>

        {/* Data Management Section */}
        <Card>
          <h2 className="text-base font-bold text-neutral-100 mb-2 flex items-center gap-2">
            <span>💾</span>
            <span>Data Management & Hygiene</span>
          </h2>
          <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
            All your data is persisted in browser <code>LocalStorage</code>. You can reset to the demonstration dataset or clear your ledger completely at any time.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={handleResetData}>
              ↺ Reset to Demo Dataset
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmClearOpen(true)}>
              🗑️ Clear All Ledger Records
            </Button>
          </div>
        </Card>

        {/* Clear Confirmation Modal */}
        <Modal
          isOpen={confirmClearOpen}
          onClose={() => setConfirmClearOpen(false)}
          title="Clear All Ledger Data?"
        >
          <div className="space-y-4">
            <p className="text-sm text-neutral-300">
              This will permanently delete all local activities, expenses, goals, and mood check-ins from your browser storage. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="md" onClick={() => setConfirmClearOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="md" onClick={handleConfirmClear}>
                Yes, Clear All
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageContainer>
  );
};
