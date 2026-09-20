import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { storageService } from '../../services/storageService';
import { STORAGE_KEYS } from '../../constants';
import { FeedbackEntry } from '../../types';
import { sanitizeString, generateSafeId } from '../../utils/sanitizers';
import { triggerConfetti } from '../../utils/confetti';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<FeedbackEntry['category']>('General');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanMsg = sanitizeString(message, 500);
    if (!cleanMsg || cleanMsg.trim().length < 5) {
      setError('Please provide at least 5 characters of feedback.');
      return;
    }

    const newFeedback: FeedbackEntry = {
      id: generateSafeId('fb'),
      rating,
      category,
      message: cleanMsg,
      email: email.trim() ? sanitizeString(email, 100) : undefined,
      createdAt: Date.now(),
    };

    const existing = storageService.getItem<FeedbackEntry[]>(STORAGE_KEYS.FEEDBACK, []);
    storageService.setItem(STORAGE_KEYS.FEEDBACK, [newFeedback, ...existing]);

    setSubmitted(true);

    if (rating >= 4) {
      triggerConfetti(2000);
    }

    if (onShowToast) {
      onShowToast(
        'Feedback Recorded!',
        'Thank you for your thoughts. Your feedback has been saved to your local audit ledger.',
        'success'
      );
    }

    setTimeout(() => {
      setMessage('');
      setEmail('');
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  const ratingOptions = [
    { value: 1, emoji: '😡', label: '1 - Poor' },
    { value: 2, emoji: '🙁', label: '2 - Fair' },
    { value: 3, emoji: '😐', label: '3 - Okay' },
    { value: 4, emoji: '😊', label: '4 - Good' },
    { value: 5, emoji: '🤩', label: '5 - Great' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="💬 Share Your Feedback">
      {submitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="text-4xl animate-bounce" aria-hidden="true">🎉</div>
          <h3 className="text-lg font-bold text-neutral-100">Thank You For Your Feedback!</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Your evaluation and insights have been recorded in your client-side audit ledger.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Rating selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-200 mb-1.5">
              How is your experience with Your Life In Receipt?
            </label>
            <div className="grid grid-cols-5 gap-2" role="group" aria-label="Rating out of 5">
              {ratingOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRating(opt.value)}
                  aria-pressed={rating === opt.value}
                  aria-label={opt.label}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all min-h-[44px] ${
                    rating === opt.value
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold scale-105 shadow-sm'
                      : 'bg-neutral-800/60 border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                  }`}
                >
                  <span className="text-xl leading-none" aria-hidden="true">{opt.emoji}</span>
                  <span className="text-[10px] mt-1 font-mono">{opt.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label htmlFor="feedback-category" className="block text-xs font-semibold text-neutral-200 mb-1">
              Feedback Category
            </label>
            <select
              id="feedback-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as FeedbackEntry['category'])}
              className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <option value="General">General Feedback</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Receipt Suggestion">Receipt Docket Suggestion</option>
            </select>
          </div>

          {/* Message input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="feedback-message" className="block text-xs font-semibold text-neutral-200">
                Your Feedback / Comments <span className="text-amber-500">*</span>
              </label>
              <span className="text-[10px] font-mono text-neutral-500">
                {message.length}/500
              </span>
            </div>
            <textarea
              id="feedback-message"
              rows={4}
              maxLength={500}
              required
              placeholder="What do you love? What features or receipt tweaks would you like to see?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 resize-none font-sans"
            />
          </div>

          {/* Optional Email */}
          <div>
            <label htmlFor="feedback-email" className="block text-xs font-semibold text-neutral-200 mb-1">
              Contact / Email <span className="text-neutral-500 font-normal">(Optional)</span>
            </label>
            <input
              id="feedback-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Feedback
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
