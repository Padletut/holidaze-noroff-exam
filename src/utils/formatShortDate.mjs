import toUtcDate from "./toUtcDate.mjs"

/**
 * Formats an ISO date into a locale-aware short day/month label without timezone drift.
 *
 * @param {string|null|undefined} dateStr - ISO date string.
 * @param {string} [locale="en-GB"] - Locale used for formatting.
 * @returns {string} Formatted date, e.g. "22 Apr", or an empty string for invalid input.
 */
export function formatShortDate(dateStr, locale = "en-GB") {
  const date = toUtcDate(dateStr)
  if (!date) return ""

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date)
}
