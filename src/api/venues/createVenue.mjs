import { BASE_URL } from "../config.mjs"
import { fetchData } from "../utils/fetchdata.mjs"

/**
 * Creates a new venue.
 *
 * @async
 * @param {Object} venueData - The venue payload.
 * @returns {Promise<Object>} The created venue object from the API.
 * @throws {Error} If the request fails.
 */
export async function createVenue(venueData) {
  const response = await fetchData(`${BASE_URL}/holidaze/venues`, {
    method: "POST",
    body: JSON.stringify(venueData),
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(
      json.errors?.[0]?.message ?? "We couldn't create the venue right now. Please try again."
    )
  }

  return json.data
}
