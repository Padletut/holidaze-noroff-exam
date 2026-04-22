const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates the registration form values.
 *
 * @param {{ name: string, email: string, password: string, confirmPassword: string }} values - The form field values to validate.
 * @returns {Object} An object containing any validation error messages, keyed by field name.
 *   Returns an empty object if all fields are valid.
 */
function validateRegisterForm(values) {
  const errors = {}
  if (!values.name) errors.name = "Please enter your name"
  else if (values.name.trim().length < 3)
    errors.name = "Name must be at least 3 characters"
  if (!values.email) errors.email = "Please enter your email"
  else if (!EMAIL_REGEX.test(values.email))
    errors.email = "Please enter a valid email address"
  else if (!values.email.endsWith("@stud.noroff.no"))
    errors.email = "Email must end with @stud.noroff.no"
  if (!values.password) errors.password = "Please enter a password"
  else if (values.password.length < 8)
    errors.password = "Please enter a password with at least 8 characters"
  if (!values.confirmPassword)
    errors.confirmPassword = "Please confirm your password"
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = "Passwords do not match"
  return errors
}

export default validateRegisterForm
