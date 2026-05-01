import toUtcDate from "./toUtcDate.mjs"

/**
 * Formats an ISO date into a long day/month label without timezone drift.
 *
 * @param {string|null|undefined} dateStr - ISO date string.
 * @param {string} [locale="en-GB"] - Locale used for formatting.
 * @returns {string} Formatted date, e.g. "22. April", or an empty string for invalid input.
 */
export function formatLongDate(dateStr, locale = "en-GB") {
  const date = toUtcDate(dateStr)
  if (!date) return ""

  const parts = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).formatToParts(date)

  const day = parts.find(({ type }) => type === "day")?.value
  const month = parts.find(({ type }) => type === "month")?.value

  return day && month ? `${day}. ${month}` : ""
}
