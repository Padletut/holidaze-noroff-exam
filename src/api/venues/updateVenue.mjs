import { BASE_URL } from "../config.mjs"
import { fetchData } from "../utils/fetchdata.mjs"

/**
 * Updates an existing venue by ID.
 *
 * @async
 * @param {string} id - The venue ID.
 * @param {Object} venueData - The updated venue payload.
 * @returns {Promise<Object>} The updated venue object from the API.
 * @throws {Error} If the request fails.
 */
export async function updateVenue(id, venueData) {
  const response = await fetchData(
    `${BASE_URL}/holidaze/venues/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(venueData),
    }
  )

  const json = await response.json()

  if (!response.ok) {
    throw new Error(
      json.errors?.[0]?.message ?? "We couldn't update the venue right now. Please try again."
    )
  }

  return json.data
}
