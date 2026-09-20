/**
 * Input validation and sanitization constraints
 * Defensively validates inputs and clamps values within safe bounds.
 */

export interface ValidationResult<T> {
  isValid: boolean;
  value: T;
  error?: string;
}

const MAX_SAFE_EXPENSE = 100_000_000;
const MAX_DAY_MINUTES = 1440; // 24 hours in minutes

/**
 * Validates expense amounts: must be numeric, finite, non-negative, and <= MAX_SAFE_EXPENSE
 */
export function validateExpenseAmount(rawAmount: unknown): ValidationResult<number> {
  if (rawAmount === '' || rawAmount === null || rawAmount === undefined) {
    return { isValid: false, value: 0, error: 'Amount is required.' };
  }

  const num = Number(rawAmount);

  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return { isValid: false, value: 0, error: 'Amount must be a valid finite number.' };
  }

  if (num < 0) {
    return { isValid: false, value: 0, error: 'Amount cannot be negative.' };
  }

  if (num > MAX_SAFE_EXPENSE) {
    return { isValid: false, value: MAX_SAFE_EXPENSE, error: `Amount cannot exceed ${MAX_SAFE_EXPENSE.toLocaleString()}.` };
  }

  // Round to 2 decimal places to avoid floating point precision issues
  const rounded = Math.round(num * 100) / 100;
  return { isValid: true, value: rounded };
}

/**
 * Validates duration in minutes: must be integer/numeric, non-negative, <= 1440 min
 */
export function validateDurationMinutes(rawMinutes: unknown): ValidationResult<number> {
  if (rawMinutes === '' || rawMinutes === null || rawMinutes === undefined) {
    return { isValid: false, value: 0, error: 'Duration is required.' };
  }

  const num = Number(rawMinutes);

  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return { isValid: false, value: 0, error: 'Duration must be a valid number.' };
  }

  if (num < 0) {
    return { isValid: false, value: 0, error: 'Duration cannot be negative.' };
  }

  if (num > MAX_DAY_MINUTES) {
    return { isValid: false, value: MAX_DAY_MINUTES, error: 'Duration cannot exceed 1440 minutes (24 hours).' };
  }

  return { isValid: true, value: Math.floor(num) };
}

/**
 * Clamps goal progress between 0 and 100
 */
export function clampGoalProgress(rawProgress: unknown): number {
  const num = Number(rawProgress);
  if (!Number.isFinite(num) || Number.isNaN(num)) return 0;
  return Math.min(100, Math.max(0, Math.round(num)));
}

/**
 * Clamps mood rating between 1 and 10
 */
export function clampMood(rawMood: unknown): number {
  const num = Number(rawMood);
  if (!Number.isFinite(num) || Number.isNaN(num)) return 5;
  return Math.min(10, Math.max(1, Math.round(num)));
}

/**
 * Clamps importance level between 1 and 5
 */
export function clampImportance(rawImportance: unknown): number {
  const num = Number(rawImportance);
  if (!Number.isFinite(num) || Number.isNaN(num)) return 3;
  return Math.min(5, Math.max(1, Math.round(num)));
}

/**
 * Validates ISO date format YYYY-MM-DD
 */
export function isValidIsoDate(dateStr: unknown): boolean {
  if (typeof dateStr !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d.getTime());
}
