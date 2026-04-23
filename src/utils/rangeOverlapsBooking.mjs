/**
 * Checks whether selecting a date range would overlap any existing booking.
 *
 * @param {string} from - ISO date string for range start.
 * @param {string} to - ISO date string for range end.
 * @param {Array<{dateFrom: string, dateTo: string}>} bookings - Existing bookings.
 * @returns {boolean} True if the range overlaps a booking.
 */
export function rangeOverlapsBooking(from, to, bookings) {
  return bookings.some(({ dateFrom, dateTo }) => {
    const bFrom = dateFrom.slice(0, 10)
    const bTo = dateTo.slice(0, 10)
    return from <= bTo && to >= bFrom
  })
}
