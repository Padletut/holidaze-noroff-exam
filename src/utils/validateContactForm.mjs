const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateContactForm(values) {
  const errors = {}

  if (!values.name.trim()) {
    errors.name = "Please enter your name"
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters"
  }

  if (!values.email) {
    errors.email = "Please enter your email"
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!values.subject.trim()) {
    errors.subject = "Please enter a subject"
  } else if (values.subject.trim().length < 3) {
    errors.subject = "Subject must be at least 3 characters"
  }

  if (!values.message.trim()) {
    errors.message = "Please enter a message"
  } else if (values.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters"
  }

  return errors
}

export default validateContactForm
