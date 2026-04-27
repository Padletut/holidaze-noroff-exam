/**
 * Builds the API request payload from venue form state.
 *
 * @param {Object} form - The flat form state object.
 * @param {Array<{url: string, alt: string}>} mediaItems - The list of media entries.
 * @returns {Object} The venue payload ready to send to the API.
 */
export function buildVenuePayload(form, mediaItems) {
  const validMedia = mediaItems.filter((m) => m.url.trim())

  return {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    maxGuests: Number(form.maxGuests),
    media: validMedia.map((m) => ({ url: m.url.trim(), alt: m.alt.trim() })),
    meta: {
      wifi: form.wifi,
      parking: form.parking,
      breakfast: form.breakfast,
      pets: form.pets,
    },
    location: {
      address: form.address.trim() || null,
      zip: form.zip.trim() || null,
      city: form.city.trim() || null,
      country: form.country.trim() || null,
    },
  }
}
