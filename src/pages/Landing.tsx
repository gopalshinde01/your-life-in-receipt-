import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { LifeReceipt } from '../components/receipt/LifeReceipt';
import { receiptService } from '../services/receiptService';
import { SEED_ACTIVITIES, SEED_EXPENSES, SEED_GOALS, SEED_MOODS, SEED_PROFILE } from '../data/initialSeedData';

import { ThemeConfig, Language } from '../types';
import { getTranslation, TranslationKey } from '../i18n/translations';

export interface LandingPageProps {
  themeConfig?: ThemeConfig;
  language?: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ themeConfig, language = 'en' }) => {
  const loc = (key: TranslationKey, fallback: string) => getTranslation(language, key) || fallback;

  const sampleReceiptData = receiptService.generateReceiptData({
    activities: SEED_ACTIVITIES,
    expenses: SEED_EXPENSES,
    goals: SEED_GOALS,
    moods: SEED_MOODS,
    profile: SEED_PROFILE,
    filterDate: '2026-09-20',
  });

  return (
    <div className="w-full space-y-16 py-8 relative overflow-hidden page-enter">
      {/* Background Animated Glowing Mesh Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] overflow-hidden pointer-events-none -z-10 hero-mesh-grid">
        <div className="absolute -top-20 left-1/4 w-[420px] h-[420px] rounded-full bg-amber-500/15 blur-[100px] animate-blob-1" />
        <div className="absolute top-40 right-1/4 w-[380px] h-[380px] rounded-full bg-blue-500/10 blur-[110px] animate-blob-2" />
        <div className="absolute top-80 left-1/3 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[90px] animate-blob-1" />
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto px-4 space-y-6 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-sm">
          <span>{loc('heroBadge', '🧾 Frontend Hackathon Showcase • Zero Backend')}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-100 tracking-tight leading-none">
          {loc('heroTitle', 'Your Entire Life,')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200">
            {loc('heroTitleHighlight', 'Printed On A Receipt.')}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          {loc('heroSubtitle', 'Transform your time, money, habits, goals, and daily vibes into a tangible, itemized digital Life Receipt. 100% private, client-side, accessible, and fast.')}
        </p>

        {/* Equal-Width Balanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-xl mx-auto">
          <Link
            to={ROUTES.DASHBOARD}
            className="w-full sm:w-48 lg:w-52 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-amber-500/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 min-h-[46px] flex items-center justify-center gap-1.5 group"
          >
            <span>{loc('launchDashboard', 'Launch Dashboard')}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>

          <Link
            to={ROUTES.RECEIPT}
            className="w-full sm:w-48 lg:w-52 px-5 py-3 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm sm:text-base border border-neutral-700 hover:border-neutral-500 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[46px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>🧾</span>
            <span>{loc('viewLiveReceipt', 'View Live Receipt')}</span>
          </Link>

          <Link
            to={ROUTES.ADD}
            className="w-full sm:w-48 lg:w-52 px-5 py-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-700 hover:border-amber-500 text-neutral-300 hover:text-amber-400 font-medium text-sm sm:text-base transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[46px] flex items-center justify-center gap-1.5"
          >
            <span>➕</span>
            <span>{loc('addDailyEntry', '+ Add Daily Entry')}</span>
          </Link>
        </div>

        {/* Social Proof Line */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-neutral-400 font-medium flex-wrap">
          <div className="flex items-center gap-1 text-amber-400">
            <span>★★★★★</span>
            <span className="font-bold text-neutral-200">4.9/5</span>
          </div>
          <span className="text-neutral-600">•</span>
          <span>1,200+ mindful lives tracked</span>
          <span className="text-neutral-600">•</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            100% Private Client-Side
          </span>
        </div>
      </section>

      {/* Feature & Receipt Showcase Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto px-4">
        {/* Left Column: Core Pillars with Card Hover Lift */}
        <div className="lg:col-span-6 space-y-5">
          <div className="border border-neutral-800 bg-neutral-900/70 p-6 rounded-2xl card-hover-lift">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl mb-3" aria-hidden="true">⏱️</div>
            <h2 className="text-lg font-bold text-neutral-100 mb-1">Time Ledger</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Track hours spent on deep coding, studying, exercise, or passive media. Every minute is accounted for with dot-leader receipt typography.
            </p>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/70 p-6 rounded-2xl card-hover-lift">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl mb-3" aria-hidden="true">💳</div>
            <h2 className="text-lg font-bold text-neutral-100 mb-1">Financial Tally</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Log daily expenses with instant category sums. Keep track of what living today cost you, without connecting bank APIs or cloud databases.
            </p>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/70 p-6 rounded-2xl card-hover-lift">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl mb-3" aria-hidden="true">⚡</div>
            <h2 className="text-lg font-bold text-neutral-100 mb-1">Transparent Life Score</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              A transparent formula combining productivity (30%), health (20%), mood (20%), goals (20%), and balance (10%) clamped from 0 to 100.
            </p>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/70 p-6 rounded-2xl card-hover-lift">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl mb-3" aria-hidden="true">🔒</div>
            <h2 className="text-lg font-bold text-neutral-100 mb-1">Local & Private Security</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              All data lives safely in your browser's LocalStorage. Zero tracking, zero third-party analytics, strict input sanitization, and defensive JSON handling.
            </p>
          </div>
        </div>

        {/* Right Column: Live Interactive Thermal Receipt */}
        <div className="lg:col-span-6 sticky top-24">
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Interactive Receipt Preview
            </span>
          </div>
          <LifeReceipt
            receiptData={sampleReceiptData}
            themeConfig={themeConfig}
            language={language}
          />
        </div>
      </section>
    </div>
  );
};
