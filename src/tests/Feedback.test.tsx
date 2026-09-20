import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeedbackModal } from '../components/common/FeedbackModal';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS } from '../constants';

describe('FeedbackModal Component & Storage', () => {
  it('renders rating options and categories when open', () => {
    render(<FeedbackModal isOpen={true} onClose={() => {}} />);

    expect(screen.getByRole('heading', { level: 2, name: /Share Your Feedback/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /Rating out of 5/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Feedback Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Feedback \/ Comments/i)).toBeInTheDocument();
  });

  it('rejects submission with less than 5 characters and displays error', () => {
    render(<FeedbackModal isOpen={true} onClose={() => {}} />);

    const textarea = screen.getByLabelText(/Your Feedback \/ Comments/i);
    const submitBtn = screen.getByRole('button', { name: /Submit Feedback/i });

    fireEvent.change(textarea, { target: { value: 'Hi' } });
    fireEvent.click(submitBtn);

    expect(screen.getByRole('alert')).toHaveTextContent(/at least 5 characters/i);
  });

  it('submits valid feedback and records it into LocalStorage', () => {
    const handleToast = vi.fn();
    const handleClose = vi.fn();

    render(
      <FeedbackModal
        isOpen={true}
        onClose={handleClose}
        onShowToast={handleToast}
      />
    );

    const textarea = screen.getByLabelText(/Your Feedback \/ Comments/i);
    const submitBtn = screen.getByRole('button', { name: /Submit Feedback/i });
    const categorySelect = screen.getByLabelText(/Feedback Category/i);

    fireEvent.change(categorySelect, { target: { value: 'Feature Request' } });
    fireEvent.change(textarea, { target: { value: 'Love the thermal paper animation and weekly comparisons!' } });
    fireEvent.click(submitBtn);

    // Verify stored item in storage
    const stored = storageService.getItem<any[]>(STORAGE_KEYS.FEEDBACK, []);
    expect(stored.length).toBeGreaterThan(0);
    expect(stored[0].category).toBe('Feature Request');
    expect(stored[0].message).toContain('Love the thermal paper animation');
    expect(handleToast).toHaveBeenCalledWith(
      expect.stringMatching(/Feedback Recorded/i),
      expect.any(String),
      'success'
    );
  });
});
