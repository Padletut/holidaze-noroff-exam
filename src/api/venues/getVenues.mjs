import { BASE_URL } from "../config.mjs"

export async function getVenues(page = 1, limit = 12) {
  try {
    const response = await fetch(
      `${BASE_URL}/holidaze/venues?page=${page}&limit=${limit}`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch venues")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching venues:", error)
    throw error
  }
}
