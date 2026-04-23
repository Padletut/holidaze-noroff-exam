import { BASE_URL } from "../config.mjs"
import { fetchData } from "../utils/fetchdata.mjs"

/**
 * Fetches all bookings for a profile by name, including venue data.
 *
 * @async
 * @param {string} name - The profile name.
 * @returns {Promise<Object[]>} Array of booking objects from the API.
 * @throws {Error} If the request fails or the response is not ok.
 */
export async function getProfileBookings(name) {
  const response = await fetchData(
    `${BASE_URL}/holidaze/profiles/${encodeURIComponent(name)}/bookings?_venue=true`,
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errors?.[0]?.message ?? "Failed to fetch bookings")
  }

  const { data } = await response.json()
  return data
}
