/**
 * Formatting helpers for receipts, dates, currency, and durations.
 */

/**
 * Formats duration in minutes into standard receipt time format: "02h 30m"
 */
export function formatMinutesToHoursMinutes(minutes: number): string {
  const safeMin = Math.max(0, Math.floor(minutes || 0));
  const hours = Math.floor(safeMin / 60);
  const remainingMin = safeMin % 60;
  
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = remainingMin.toString().padStart(2, '0');
  
  return `${paddedHours}h ${paddedMinutes}m`;
}

/**
 * Formats monetary amounts with currency symbol and locale separators: "₹310.00"
 */
export function formatCurrency(amount: number, currency = '₹'): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const formatted = safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: safeAmount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${currency}${formatted}`;
}

/**
 * Formats ISO date string (YYYY-MM-DD) into receipt uppercase date: "20 SEP 2026"
 */
export function formatReceiptDate(isoDate?: string): string {
  try {
    const d = isoDate ? new Date(isoDate + 'T00:00:00') : new Date();
    if (isNaN(d.getTime())) {
      return '20 SEP 2026';
    }
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const day = d.getDate().toString().padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return '20 SEP 2026';
  }
}

/**
 * Formats a plain text receipt row with dot leaders for copy/export:
 * "Coding ...................... 02h 30m"
 */
export function formatDotLeaderText(left: string, right: string, totalWidth = 36): string {
  const safeLeft = left.trim();
  const safeRight = right.trim();
  
  const minSpace = 2;
  const availableDots = totalWidth - safeLeft.length - safeRight.length - minSpace;
  
  if (availableDots <= 0) {
    return `${safeLeft} ${safeRight}`;
  }
  
  const dots = '.'.repeat(availableDots);
  return `${safeLeft} ${dots} ${safeRight}`;
}
