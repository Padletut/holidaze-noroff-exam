import { BASE_URL } from "../config.mjs"
import { fetchData } from "../utils/fetchdata.mjs"

/**
 * Deletes (cancels) a booking by ID.
 *
 * @async
 * @param {string} id - The booking ID to delete.
 * @returns {Promise<void>}
 * @throws {Error} If the request fails.
 */
export async function deleteBooking(id) {
  const response = await fetchData(
    `${BASE_URL}/holidaze/bookings/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  )

  if (!response.ok) {
    let message = "We couldn't cancel your booking right now. Please try again."
    try {
      const json = await response.json()
      message = json.errors?.[0]?.message ?? message
    } catch {
      // 204 No Content or non-JSON response — ignore
    }
    throw new Error(message)
  }
}
