import { BASE_URL } from "../config.mjs"
import { fetchData } from "../utils/fetchdata.mjs"

/**
 * Updates a profile by name.
 *
 * @async
 * @param {string} name - The profile name.
 * @param {Object} body - Fields to update (bio, avatar, banner, venueManager).
 * @returns {Promise<Object>} The updated profile data object from the API.
 * @throws {Error} If the request fails or the response is not ok.
 */
export async function updateProfile(name, body) {
  const response = await fetchData(
    `${BASE_URL}/holidaze/profiles/${encodeURIComponent(name)}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errors?.[0]?.message ?? "Failed to update profile")
  }

  const { data } = await response.json()
  return data
}
