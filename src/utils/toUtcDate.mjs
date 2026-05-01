/**
 * Parses an ISO date string into a UTC Date object, avoiding timezone drift.
 *
 * @param {string|null|undefined} dateStr - ISO date string (YYYY-MM-DD).
 * @returns {Date|null} UTC Date object, or null if input is falsy.
 */
function toUtcDate(dateStr) {
  if (!dateStr) return null

  const [year, month, day] = String(dateStr)
    .slice(0, 10)
    .split("-")
    .map(Number)

  return new Date(Date.UTC(year, month - 1, day))
}

export default toUtcDate
