function validateLoginForm(values) {
  const errors = {}
  if (!values.email) errors.email = "Please enter your email"
  else if (!values.email.endsWith("@stud.noroff.no"))
    errors.email = "Email must end with @stud.noroff.no"
  if (!values.password) errors.password = "Please enter your password"
  else if (values.password.length < 8)
    errors.password = "Please enter a password with at least 8 characters"
  return errors
}

export default validateLoginForm
