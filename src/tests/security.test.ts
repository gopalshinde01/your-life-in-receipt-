import { describe, it, expect } from 'vitest';
import { sanitizeString, isValidSafeUrl } from '../utils/sanitizers';
import { validateExpenseAmount, validateDurationMinutes, clampGoalProgress, clampMood } from '../utils/validators';

describe('Security & Data Sanitization', () => {
  it('strips malicious HTML tags and script injections', () => {
    const malicious = '<script>alert("xss")</script>Clean Description<img src="x" onerror="steal()" />';
    const sanitized = sanitizeString(malicious);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
    expect(sanitized).not.toContain('<img');
    expect(sanitized).toContain('Clean Description');
  });

  it('handles non-string inputs safely without throwing', () => {
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
    expect(sanitizeString(12345)).toBe('12345');
  });

  it('rejects unsafe URL protocols and accepts only http / https', () => {
    expect(isValidSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isValidSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isValidSafeUrl('file:///etc/passwd')).toBe(false);
    expect(isValidSafeUrl('about:blank')).toBe(false);

    expect(isValidSafeUrl('https://receipt.app')).toBe(true);
    expect(isValidSafeUrl('http://localhost:3000')).toBe(true);
  });

  it('validates expense amount bounds and rejects negative numbers / NaN / Infinity', () => {
    expect(validateExpenseAmount(-50).isValid).toBe(false);
    expect(validateExpenseAmount(NaN).isValid).toBe(false);
    expect(validateExpenseAmount(Infinity).isValid).toBe(false);
    expect(validateExpenseAmount(100_000_001).isValid).toBe(false);

    const valid = validateExpenseAmount(180.50);
    expect(valid.isValid).toBe(true);
    expect(valid.value).toBe(180.5);
  });

  it('validates activity duration bounds and rejects unrealistic values', () => {
    expect(validateDurationMinutes(-10).isValid).toBe(false);
    expect(validateDurationMinutes(1500).isValid).toBe(false); // > 1440 min

    const valid = validateDurationMinutes(120);
    expect(valid.isValid).toBe(true);
    expect(valid.value).toBe(120);
  });

  it('clamps goal progress strictly between 0 and 100', () => {
    expect(clampGoalProgress(-20)).toBe(0);
    expect(clampGoalProgress(150)).toBe(100);
    expect(clampGoalProgress(75.6)).toBe(76);
  });

  it('clamps mood rating strictly between 1 and 10', () => {
    expect(clampMood(-5)).toBe(1);
    expect(clampMood(15)).toBe(10);
    expect(clampMood(8)).toBe(8);
  });
});
