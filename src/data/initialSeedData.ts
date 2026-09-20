import { Activity, Expense, Goal, MoodEntry, UserProfile } from '../types';

const TODAY_DATE = '2026-09-20';

export const SEED_PROFILE: UserProfile = {
  name: 'Gopal Shinde',
  headline: 'Product Craftsman & Full-Stack Builder',
  currency: '₹',
  lifePhilosophy: 'Transforming fleeting moments into permanent, intentional milestones.',
  targetSleepHours: 8,
};

export const SEED_ACTIVITIES: Activity[] = [
  {
    id: 'act_1',
    title: 'Frontend Architecture & Testing Suite',
    category: 'Coding',
    durationMinutes: 150, // 02h 30m
    date: TODAY_DATE,
    notes: 'Implemented Vitest test suite and accessibility audit compliance.',
    createdAt: 1774160000000,
  },
  {
    id: 'act_2',
    title: 'Core Web Vitals & Distributed Systems Study',
    category: 'Study',
    durationMinutes: 200, // 03h 20m
    date: TODAY_DATE,
    notes: 'Studied INP optimization and memory bounds.',
    createdAt: 1774163000000,
  },
  {
    id: 'act_3',
    title: 'HIIT & Core Calisthenics Routine',
    category: 'Exercise',
    durationMinutes: 40, // 00h 40m
    date: TODAY_DATE,
    notes: 'Cardio endurance and stretching session.',
    createdAt: 1774167000000,
  },
  {
    id: 'act_4',
    title: 'Tech Twitter & Design Feeds',
    category: 'Social Media',
    durationMinutes: 80, // 01h 20m
    date: TODAY_DATE,
    notes: 'Browsed design inspirations and release notes.',
    createdAt: 1774170000000,
  },
];

export const SEED_EXPENSES: Expense[] = [
  {
    id: 'exp_1',
    amount: 180,
    category: 'Food',
    description: 'Wholesome Mediterranean bowl & cold brew',
    date: TODAY_DATE,
    createdAt: 1774161000000,
  },
  {
    id: 'exp_2',
    amount: 80,
    category: 'Travel',
    description: 'Eco-metro transit to workspace hub',
    date: TODAY_DATE,
    createdAt: 1774165000000,
  },
  {
    id: 'exp_3',
    amount: 50,
    category: 'Entertainment',
    description: 'Indie game soundtrack purchase',
    date: TODAY_DATE,
    createdAt: 1774169000000,
  },
];

export const SEED_GOALS: Goal[] = [
  {
    id: 'goal_1',
    title: 'Completed project frontend test suite',
    category: 'Engineering',
    targetDate: TODAY_DATE,
    progress: 100,
    completed: true,
    createdAt: 1774100000000,
  },
  {
    id: 'goal_2',
    title: 'Read 25 pages of Clean Code philosophy',
    category: 'Learning',
    targetDate: TODAY_DATE,
    progress: 75,
    completed: false,
    createdAt: 1774110000000,
  },
  {
    id: 'goal_3',
    title: 'Drink 3 Liters of Water Daily',
    category: 'Health',
    targetDate: TODAY_DATE,
    progress: 90,
    completed: false,
    createdAt: 1774120000000,
  },
];

export const SEED_MOODS: MoodEntry[] = [
  {
    id: 'mood_1',
    rating: 8,
    note: 'Energized by solid progress on the automated evaluation criteria.',
    date: TODAY_DATE,
    createdAt: 1774175000000,
  },
];
