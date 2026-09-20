import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ECellPage } from '../pages/ECellPage';

describe('E-CELL DYPTC Portal & Page', () => {
  it('renders authentic E-CELL DYPTC branding, headline, and stats', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ECellPage />
      </MemoryRouter>
    );

    // Header Branding
    expect(screen.getAllByText(/E-CELL DYPTC/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Talsande, Kolhapur/i).length).toBeGreaterThan(0);

    // Hero Headline & Affiliation
    expect(screen.getByRole('heading', { level: 1, name: /Turning Ideas Into Impact/i })).toBeInTheDocument();
    expect(screen.getAllByText(/AUTONOMOUS INSTITUTE AFFILIATED WITH SHIVAJI UNIVERSITY/i).length).toBeGreaterThan(0);

    // Stat Pills
    expect(screen.getAllByText(/Flagship Programs/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Incubated Ventures/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Student Executive Leads/i).length).toBeGreaterThan(0);
  });

  it('renders the venture spotlight for Your Life In Receipt', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ECellPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Star Incubated Venture/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Your Life In Receipt/i })).toBeInTheDocument();
    expect(screen.getByText(/VENTURE ID: DYPTC-ST-001/i)).toBeInTheDocument();
  });

  it('opens the Join E-Cell modal on button click and submits application', () => {
    const toastSpy = vi.fn();
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ECellPage onShowToast={toastSpy} />
      </MemoryRouter>
    );

    const joinBtns = screen.getAllByRole('button', { name: /Join E-Cell/i });
    fireEvent.click(joinBtns[0]);

    // Modal dialog appears
    expect(screen.getByRole('dialog', { name: /Join E-Cell DYPTC/i })).toBeInTheDocument();
    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: 'Gopal Shinde' } });

    const submitBtn = screen.getByRole('button', { name: /Submit Application/i });
    fireEvent.click(submitBtn);

    expect(toastSpy).toHaveBeenCalledWith(
      'Application Submitted!',
      expect.stringContaining('Gopal Shinde'),
      'success'
    );
  });
});
