import { BASE_URL } from "../config.mjs"
import { fetchData } from "../utils/fetchdata.mjs"

/**
 * Updates an existing booking by ID.
 *
 * @async
 * @param {string} id - The booking ID.
 * @param {{ dateFrom?: string, dateTo?: string, guests?: number }} bookingData
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
    throw new Error(json.errors?.[0]?.message ?? "Failed to update booking")
  }

  return json.data
}
