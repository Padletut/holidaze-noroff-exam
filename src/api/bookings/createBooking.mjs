import { BASE_URL } from "../config.mjs"
import { fetchData } from "../utils/fetchdata.mjs"

/**
 * Creates a new booking.
 *
 * @async
 * @param {{ dateFrom: string, dateTo: string, guests: number, venueId: string }} bookingData
 * @returns {Promise<Object>} The created booking object from the API.
 * @throws {Error} If the request fails.
 */
export async function createBooking(bookingData) {
  const response = await fetchData(`${BASE_URL}/holidaze/bookings`, {
    method: "POST",
    body: JSON.stringify(bookingData),
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message ?? "We couldn't complete your booking right now. Please try again.")
  }

  return json.data
}
