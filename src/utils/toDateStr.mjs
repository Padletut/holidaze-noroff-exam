/**
 * Formats a year, month, and day into an ISO date string (YYYY-MM-DD).
 *
 * @param {number} year - Full four-digit year.
 * @param {number} month - Zero-based month index (0 = January).
 * @param {number} day - Day of the month.
 * @returns {string} ISO date string, e.g. "2026-04-22".
 */
export function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}
