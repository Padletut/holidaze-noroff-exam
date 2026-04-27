/**
 * Checks whether a date string falls within any booked period.
 *
 * @param {string} dateStr - ISO date string (YYYY-MM-DD) to check.
 * @param {Array<{dateFrom: string, dateTo: string}>} bookings - Array of booking objects.
 * @returns {boolean} True if the date is booked.
 */
export function isBooked(dateStr, bookings) {
  return bookings.some(({ dateFrom, dateTo }) => {
    const from = dateFrom.slice(0, 10)
    const to = dateTo.slice(0, 10)
    return dateStr >= from && dateStr <= to
  })
}
