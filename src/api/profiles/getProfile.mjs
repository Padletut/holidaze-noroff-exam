import { BASE_URL } from "../config.mjs"
import { fetchData } from "../utils/fetchdata.mjs"

/**
 * Fetches a single profile by name.
 *
 * @async
 * @param {string} name - The profile name.
 * @returns {Promise<Object>} The profile data object from the API.
 * @throws {Error} If the request fails or the response is not ok.
 */
export async function getProfile(name) {
  const response = await fetchData(
    `${BASE_URL}/holidaze/profiles/${encodeURIComponent(name)}`,
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errors?.[0]?.message ?? "Failed to fetch profile")
  }

  const { data } = await response.json()
  return data
}
