const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates the login form values.
 *
 * @param {{ email: string, password: string }} values - The form field values to validate.
 * @returns {Object} An object containing any validation error messages, keyed by field name.
 *   Returns an empty object if all fields are valid.
 */
function validateLoginForm(values) {
  const errors = {}
  if (!values.email) errors.email = "Please enter your email"
  else if (!EMAIL_REGEX.test(values.email))
    errors.email = "Please enter a valid email address"
  else if (!values.email.endsWith("@stud.noroff.no"))
    errors.email = "Email must end with @stud.noroff.no"
  if (!values.password) errors.password = "Please enter your password"
  else if (values.password.length < 8)
    errors.password = "Please enter a password with at least 8 characters"
  return errors
}

export default validateLoginForm
