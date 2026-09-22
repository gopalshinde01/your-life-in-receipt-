import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import { TodayFocus } from '../components/dashboard/TodayFocus';
import { RecentEntries } from '../components/dashboard/RecentEntries';
import { WeeklyTrendCharts } from '../components/analytics/WeeklyTrendCharts';
import { ScoreOverview } from '../components/dashboard/ScoreOverview';
import { Goal, Activity, Expense, MoodEntry, NoteEntry } from '../types';

describe('Dashboard Enhanced Components & Data Integrity', () => {
  const sampleGoals: Goal[] = [
    {
      id: 'g1',
      title: 'Complete DSA Practice',
      description: 'Solve 3 graph questions daily',
      category: 'Study',
      targetDate: '2026-09-30',
      progress: 65,
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: 'g2',
      title: 'Finish Client Demo',
      category: 'Work',
      targetDate: '2026-10-01',
      progress: 100,
      completed: true,
      createdAt: Date.now(),
    },
  ];

  it('renders TodayFocus with active incomplete goals and progress', () => {
    render(
      <HashRouter>
        <TodayFocus goals={sampleGoals} />
      </HashRouter>
    );

    expect(screen.getByText(/Today's Focus/i)).toBeInTheDocument();
    expect(screen.getByText('Complete DSA Practice')).toBeInTheDocument();
    expect(screen.getByText(/65%/i)).toBeInTheDocument();
    // Incomplete goal should be present, completed goal should not be in active focus
    expect(screen.queryByText('Finish Client Demo')).not.toBeInTheDocument();
  });

  it('renders TodayFocus empty state when all goals are completed or absent', () => {
    render(
      <HashRouter>
        <TodayFocus goals={[]} />
      </HashRouter>
    );

    expect(screen.getByText(/No focus items yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Create Goal/i })).toBeInTheDocument();
  });

  it('renders RecentEntries with unified activities, expenses, moods, and notes', () => {
    const activities: Activity[] = [
      {
        id: 'a1',
        title: 'System Design Mock',
        category: 'Study',
        durationMinutes: 90,
        date: '2026-09-22',
        createdAt: Date.now(),
      },
    ];
    const expenses: Expense[] = [
      {
        id: 'e1',
        description: 'Team Lunch',
        amount: 350,
        category: 'Food',
        date: '2026-09-22',
        createdAt: Date.now(),
      },
    ];
    const moods: MoodEntry[] = [
      {
        id: 'm1',
        rating: 9,
        note: 'Super productive evening',
        date: '2026-09-22',
        createdAt: Date.now(),
      },
    ];
    const notes: NoteEntry[] = [
      {
        id: 'n1',
        title: 'Architectural Lesson',
        description: 'Separate query computation from presentation layer',
        date: '2026-09-22',
        createdAt: Date.now(),
      },
    ];

    render(
      <HashRouter>
        <RecentEntries
          activities={activities}
          expenses={expenses}
          moods={moods}
          notes={notes}
          currency="₹"
        />
      </HashRouter>
    );

    expect(screen.getByText(/Recent Entries/i)).toBeInTheDocument();
    expect(screen.getByText('System Design Mock')).toBeInTheDocument();
    expect(screen.getByText('Team Lunch')).toBeInTheDocument();
    expect(screen.getByText(/Mood 9\/10/i)).toBeInTheDocument();
    expect(screen.getByText('Architectural Lesson')).toBeInTheDocument();
    expect(screen.getByText(/View all activities/i)).toBeInTheDocument();
  });

  it('renders ScoreOverview and opens mathematical explanation modal on breakdown click', async () => {
    const user = userEvent.setup();
    const scoreData = {
      productivity: 80,
      health: 75,
      mood: 85,
      goals: 90,
      balance: 70,
      finalScore: 81,
      explanation: 'Balanced execution with strong momentum.',
    };

    render(<ScoreOverview scoreData={scoreData} />);

    expect(screen.getByText('81')).toBeInTheDocument();
    const breakdownBtn = screen.getByRole('button', { name: /View transparent Life Score calculation breakdown/i });
    expect(breakdownBtn).toBeInTheDocument();

    await user.click(breakdownBtn);

    expect(screen.getByText(/Mathematical Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Score = \(P × 0\.30\)/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close Breakdown/i });
    await user.click(closeBtn);

    expect(screen.queryByText(/Score = \(P × 0\.30\)/i)).not.toBeInTheDocument();
  });

  it('renders WeeklyTrendCharts with all 5 metrics and handles empty state gracefully', () => {
    render(
      <HashRouter>
        <WeeklyTrendCharts
          activities={[]}
          expenses={[]}
          goals={[]}
          moods={[]}
          currency="₹"
        />
      </HashRouter>
    );

    expect(screen.getByText(/Weekly 7-Day Performance Trends/i)).toBeInTheDocument();
    expect(screen.getByText(/No productivity data recorded yet/i)).toBeInTheDocument();
    expect(screen.getByText(/No expenses recorded yet/i)).toBeInTheDocument();
    expect(screen.getByText(/No activity data yet/i)).toBeInTheDocument();
    expect(screen.getByText(/No mood records this week/i)).toBeInTheDocument();
    expect(screen.getByText(/No goals completed this week/i)).toBeInTheDocument();
  });
});
