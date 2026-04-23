import { BASE_URL } from "../config.mjs"

/**
 * Fetches a single venue by its ID, including bookings and owner.
 *
 * @async
 * @param {string} id - The venue ID.
 * @returns {Promise<Object>} The venue data object from the API.
 * @throws {Error} If the request fails or the response is not ok.
 */
export async function getVenueById(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/holidaze/venues/${id}?_bookings=true&_owner=true&_customer=true`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch venue")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching venue:", error)
    throw error
  }
}
