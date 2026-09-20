import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard';
import { LandingPage } from '../pages/Landing';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SEED_ACTIVITIES, SEED_EXPENSES, SEED_GOALS, SEED_MOODS, SEED_PROFILE } from '../data/initialSeedData';

const mockLifeData: any = {
  activities: SEED_ACTIVITIES,
  expenses: SEED_EXPENSES,
  goals: SEED_GOALS,
  moods: SEED_MOODS,
  profile: SEED_PROFILE,
  deleteActivity: () => {},
  deleteExpense: () => {},
};

describe('Routing & Fallback Navigation', () => {
  it('starts website with dashboard at root route /', () => {
    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<DashboardPage lifeData={mockLifeData} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Welcome back/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Receipt/i })).toBeInTheDocument();
  });

  it('renders landing page at /landing route', () => {
    render(
      <MemoryRouter initialEntries={['/landing']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Your Entire Life/i })).toBeInTheDocument();
  });

  it('renders 404 fallback on unrecognized route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-path-123']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/404 — Ledger Entry Not Found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Return to Dashboard/i })).toBeInTheDocument();
  });
});
