import toUtcDate from "./toUtcDate.mjs"

const DAY_IN_MS = 86400000

/**
 * Returns the number of calendar days between two ISO dates without timezone drift.
 *
 * @param {string|null|undefined} from - Start ISO date string.
 * @param {string|null|undefined} to - End ISO date string.
 * @returns {number} Number of days between the dates.
 */
export function differenceInDays(from, to) {
  const start = toUtcDate(from)
  const end = toUtcDate(to)

  if (!start || !end) return 0

  return Math.round((end - start) / DAY_IN_MS)
}
