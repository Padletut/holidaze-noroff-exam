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

/**
 * Formats an ISO date string (YYYY-MM-DD) into a human-readable DD.MM.YYYY string.
 *
 * @param {string|null|undefined} dateStr - ISO date string to format.
 * @returns {string|null} Formatted date string, e.g. "22.04.2026", or null if input is falsy.
 */
export function formatDisplay(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split("-")
  return `${d}.${m}.${y}`
}

/**
 * Returns the number of days in a given month.
 *
 * @param {number} year - Full four-digit year.
 * @param {number} month - Zero-based month index (0 = January).
 * @returns {number} Number of days in the month.
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Returns the Monday-first weekday index of the first day of a given month.
 * Monday = 0, Tuesday = 1, ..., Sunday = 6.
 *
 * @param {number} year - Full four-digit year.
 * @param {number} month - Zero-based month index (0 = January).
 * @returns {number} Weekday index of the first day (0–6).
 */
export function getFirstWeekday(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7
}
