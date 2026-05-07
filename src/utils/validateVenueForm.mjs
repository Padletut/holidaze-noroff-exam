/**
 * Validates the venue form values.
 *
 * @param {{ name: string, description: string, price: string|number, maxGuests: string|number }} values
 * @returns {string|null} An error message string, or null if all fields are valid.
 */
function validateVenueForm(values) {
  if (!values.name.trim()) return "Title is required."
  if (!values.description.trim()) return "Description is required."
  if (!values.price || isNaN(Number(values.price)))
    return "A valid price is required."
  if (!values.maxGuests || isNaN(Number(values.maxGuests)))
    return "Max guests is required."
  if (values.rating !== "" && isNaN(Number(values.rating)))
    return "Rating must be a number."
  if (Number(values.rating) < 0 || Number(values.rating) > 5)
    return "Rating must be between 0 and 5."
  return null
}

export default validateVenueForm
