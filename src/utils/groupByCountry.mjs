export function groupByCountry(venues) {
  return venues.reduce((groups, venue) => {
    const country = venue.location?.country?.trim() || "Other"
    if (!groups[country]) groups[country] = []
    groups[country].push(venue)
    return groups
  }, {})
}
