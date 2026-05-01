import { formatShortDate } from "./formatShortDate.mjs"

/**
 * Formats a start and end ISO date into a short range label.
 *
 * @param {string|null|undefined} from - Start ISO date string.
 * @param {string|null|undefined} to - End ISO date string.
 * @param {string} [locale="en-GB"] - Locale used for formatting.
 * @returns {string} Formatted range, e.g. "22 Apr – 24 Apr".
 */
export function formatDateRange(from, to, locale = "en-GB") {
  return `${formatShortDate(from, locale)} – ${formatShortDate(to, locale)}`
}
