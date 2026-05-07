import { BASE_URL } from "../config.mjs"

/**
 * Fetches a paginated list of venues from the API.
 *
 * @async
 * @param {number} [page=1] - The page number to fetch.
 * @param {number} [limit=12] - The number of venues per page.
 * @param {RequestInit} [options={}] - Optional fetch options.
 * @returns {Promise<Object>} The paginated API response containing venue data and meta.
 * @throws {Error} If the request fails or the response is not ok.
 */
export async function getVenues(page = 1, limit = 12, options = {}) {
  try {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort: "created",
      sortOrder: "asc",
    })

    const response = await fetch(
      `${BASE_URL}/holidaze/venues?${queryParams.toString()}`,
      options,
    )

    if (!response.ok) {
      throw new Error("We couldn't load venues right now. Please try again.")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching venues:", error)
    throw error
  }
}
