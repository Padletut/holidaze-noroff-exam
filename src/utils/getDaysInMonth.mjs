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
