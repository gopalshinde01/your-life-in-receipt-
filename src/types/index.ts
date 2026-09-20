export type ActivityCategory = 
  | 'Coding' 
  | 'Study' 
  | 'Work' 
  | 'Exercise' 
  | 'Social Media' 
  | 'Entertainment' 
  | 'Reading' 
  | 'Sleep' 
  | 'Chores' 
  | 'Other';

export type ExpenseCategory = 
  | 'Food' 
  | 'Travel' 
  | 'Entertainment' 
  | 'Utilities' 
  | 'Shopping' 
  | 'Education' 
  | 'Health' 
  | 'Other';

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  durationMinutes: number; // in minutes >= 0
  date: string; // ISO date string YYYY-MM-DD
  notes?: string;
  createdAt: number;
}

export interface Expense {
  id: string;
  amount: number; // >= 0
  category: ExpenseCategory;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: number;
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  targetDate: string;
  progress: number; // 0 to 100
  completed: boolean;
  createdAt: number;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  importance: number; // 1 to 5
  date: string;
  createdAt: number;
}

export interface MoodEntry {
  id: string;
  rating: number; // 1 to 10
  note?: string;
  date: string;
  createdAt: number;
}

export interface FeedbackEntry {
  id: string;
  rating: number; // 1 to 5
  category: 'General' | 'Feature Request' | 'Bug Report' | 'Receipt Suggestion';
  message: string;
  email?: string;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  headline?: string;
  currency: string; // e.g. '₹', '$', '€', '£'
  lifePhilosophy?: string;
  targetSleepHours: number; // default 8
}

export interface LifeScoreBreakdown {
  productivity: number; // 0-100
  health: number; // 0-100
  mood: number; // 0-100
  goals: number; // 0-100
  balance: number; // 0-100
  finalScore: number; // 0-100 weighted
  explanation: string;
}

export interface MockInsight {
  id: string;
  category: 'strength' | 'observation' | 'recommendation' | 'alert';
  title: string;
  message: string;
  impactScore?: number;
  timestamp: string;
}

export interface LifeReceiptData {
  receiptId: string;
  dateFormatted: string;
  userName: string;
  currency: string;
  timeSpentByCategory: { category: string; minutes: number; formatted: string }[];
  totalTimeMinutes: number;
  totalTimeFormatted: string;
  expensesByCategory: { category: string; amount: number; formatted: string }[];
  totalExpenses: number;
  totalExpensesFormatted: string;
  completedAchievements: string[];
  inProgressGoals: { title: string; progress: number }[];
  averageMood: number | null;
  lifeScoreBreakdown: LifeScoreBreakdown;
  aiInsight: string;
  barcodeValue: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export type AppTheme = 'classic' | 'cyberpunk' | 'clean-paper' | 'midnight' | 'retro-grocer' | 'pure-white';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  receiptBg: string;
  receiptText: string;
  receiptBorder: string;
  receiptTearColor: string;
  isLightMode?: boolean;
}

export type Language = 'en' | 'hi' | 'mr';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

