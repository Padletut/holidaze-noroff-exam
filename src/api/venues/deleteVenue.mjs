import { BASE_URL } from "../config.mjs"
import { fetchData } from "../utils/fetchdata.mjs"

/**
 * Deletes a venue by ID.
 *
 * @async
 * @param {string} id - The venue ID to delete.
 * @returns {Promise<void>}
 * @throws {Error} If the request fails.
 */
export async function deleteVenue(id) {
  const response = await fetchData(
    `${BASE_URL}/holidaze/venues/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  )

  if (!response.ok) {
    let message = "We couldn't delete the venue right now. Please try again."
    try {
      const json = await response.json()
      message = json.errors?.[0]?.message ?? message
    } catch {
      // 204 No Content – ignore
    }
    throw new Error(message)
  }
}
