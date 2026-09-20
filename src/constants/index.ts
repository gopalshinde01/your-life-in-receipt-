import { ActivityCategory, ExpenseCategory, UserProfile } from '../types';

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  'Coding',
  'Study',
  'Work',
  'Exercise',
  'Social Media',
  'Entertainment',
  'Reading',
  'Sleep',
  'Chores',
  'Other',
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Travel',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Education',
  'Health',
  'Other',
];

export const STORAGE_KEYS = {
  ACTIVITIES: 'life_receipt_activities_v1',
  EXPENSES: 'life_receipt_expenses_v1',
  GOALS: 'life_receipt_goals_v1',
  EXPERIENCES: 'life_receipt_experiences_v1',
  MOODS: 'life_receipt_moods_v1',
  PROFILE: 'life_receipt_profile_v1',
  THEME: 'life_receipt_theme_v1',
  LANGUAGE: 'life_receipt_language_v1',
  FEEDBACK: 'life_receipt_feedback_v1',
} as const;

export const THEMES = [
  {
    id: 'classic' as const,
    name: 'Classic Thermal',
    description: 'Warm obsidian background with authentic beige thermal paper and amber accents',
    icon: '🧾',
    accentColor: '#f59e0b',
    receiptBg: '#faf8f5',
    receiptText: '#1f1e1d',
    receiptBorder: '#e6e1da',
    receiptTearColor: '#faf8f5',
    isLightMode: false,
  },
  {
    id: 'pure-white' as const,
    name: 'Pure White (Light)',
    description: 'Crisp daylight mode with pure white paper, light slate backdrop, and dark slate typography',
    icon: '☀️',
    accentColor: '#2563eb',
    receiptBg: '#ffffff',
    receiptText: '#0f172a',
    receiptBorder: '#cbd5e1',
    receiptTearColor: '#ffffff',
    isLightMode: true,
  },
];


export const DEFAULT_PROFILE: UserProfile = {
  name: 'Gopal Shinde',
  headline: 'Product Craftsman & Full-Stack Builder',
  currency: '₹',
  lifePhilosophy: 'Transforming fleeting moments into permanent, intentional milestones.',
  targetSleepHours: 8,
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LANDING: '/landing',
  ECELL: '/ecell',
  ADD: '/add',
  RECEIPT: '/receipt',
  EXPENSES: '/expenses',
  ACTIVITIES: '/activities',
  GOALS: '/goals',
  ANALYTICS: '/analytics',
  INSIGHTS: '/insights',
  PROFILE: '/profile',
} as const;

export const LIFE_SCORE_WEIGHTS = {
  PRODUCTIVITY: 0.30,
  HEALTH: 0.20,
  MOOD: 0.20,
  GOALS: 0.20,
  BALANCE: 0.10,
} as const;

export const CURRENCIES = [
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
];
