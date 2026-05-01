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
