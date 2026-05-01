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
