import { BASE_URL } from "./config.js"

export async function getVenues() {
  try {
    const response = await fetch(`${BASE_URL}/holidaze/venues`)

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
