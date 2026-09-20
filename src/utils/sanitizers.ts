/**
 * Security & Sanitization utilities
 * Enforces defensive data handling, prevents XSS, HTML injection, and unsafe URL schemes.
 */

/**
 * Strips dangerous HTML tags and control characters from user strings.
 * Renders safe plain text.
 */
export function sanitizeString(input: unknown, maxLength = 250): string {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return '';
    return String(input).slice(0, maxLength).trim();
  }

  // Strip XML/HTML tags
  const stripped = input.replace(/<\/?[^>]+(>|$)/g, '');

  // Strip null bytes and control characters except standard whitespace
  const sanitized = stripped.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized.slice(0, maxLength).trim();
}

/**
 * Validates URLs to ensure only safe schemes (http:, https:) are permitted.
 * Blocks javascript:, data:, blob:, file:, and malformed inputs.
 */
export function isValidSafeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  
  // Reject protocol-relative or dangerous schemes
  if (/^(javascript|data|vbscript|file|about):/i.test(trimmed)) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Generates a collision-resistant unique ID without external heavy libraries
 */
export function generateSafeId(prefix = 'id'): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${randomPart}`;
}
