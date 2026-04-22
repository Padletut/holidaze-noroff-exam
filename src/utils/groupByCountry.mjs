/**
 * Groups an array of venue objects by their country.
 * Venues without a country are placed under "Other".
 *
 * @param {Array<Object>} venues - Array of venue objects from the API.
 * @returns {Object} An object where each key is a country name and the value is an array of venues.
 */
export function groupByCountry(venues) {
  return venues.reduce((groups, venue) => {
    const country = venue.location?.country?.trim() || "Other"
    if (!groups[country]) groups[country] = []
    groups[country].push(venue)
    return groups
  }, {})
}
