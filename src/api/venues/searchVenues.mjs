import { BASE_URL } from "../config.mjs"

/**
 * Searches for venues by name or description.
 *
 * @async
 * @param {string} query - The search query to match against venue name or description.
 * @returns {Promise<Object>} The search results data from the API.
 * @throws {Error} If the request fails or the response is not ok.
 */
export async function searchVenues(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/holidaze/venues/search?q=${encodeURIComponent(query)}`
    )

    if (!response.ok) {
      throw new Error("We couldn't complete your search right now. Please try again.")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error searching venues:", error)
    throw error
  }
}
