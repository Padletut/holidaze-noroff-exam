import { BASE_URL } from "../config.mjs"
import { fetchData } from "../utils/fetchdata.mjs"

/**
 * Fetches all venues owned by a profile.
 *
 * @async
 * @param {string} name - The profile name.
 * @returns {Promise<Array>} An array of venue objects.
 * @throws {Error} If the request fails or the response is not ok.
 */
export async function getProfileVenues(name) {
  const response = await fetchData(
    `${BASE_URL}/holidaze/profiles/${encodeURIComponent(name)}/venues?_owner=true&_bookings=true`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(
      error.errors?.[0]?.message ?? "We couldn't load your venues right now. Please try again."
    )
  }

  const { data } = await response.json()
  return data
}
