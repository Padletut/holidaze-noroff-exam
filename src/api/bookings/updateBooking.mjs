import { BASE_URL } from "../config.mjs"
import { fetchData } from "../utils/fetchdata.mjs"

/**
 * Updates an existing booking by ID.
 *
 * @async
 * @param {string} id - The booking ID.
 * @param {Object} bookingData - Partial booking payload to update.
 * @param {string} [bookingData.dateFrom] - Updated check-in date (ISO string).
 * @param {string} [bookingData.dateTo] - Updated check-out date (ISO string).
 * @param {number} [bookingData.guests] - Updated number of guests.
 * @returns {Promise<Object>} The updated booking object from the API.
 * @throws {Error} If the request fails.
 */
export async function updateBooking(id, bookingData) {
  const response = await fetchData(
    `${BASE_URL}/holidaze/bookings/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(bookingData),
    },
  )

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message ?? "We couldn't update your booking right now. Please try again.")
  }

  return json.data
}
