import { useState } from "react"
import "../../styles/index.scss"
import validateContactForm from "../../utils/validateContactForm.mjs"
import Alert from "../../components/Alert"

const INITIAL = { name: "", email: "", subject: "", message: "" }

function FieldGroup({ id, label, error, valid, children }) {
  return (
    <div className="contact-form__group">
      <label htmlFor={id} className="contact-form__label">
        {label}
      </label>
      <div className="contact-form__input-wrapper">
        {children}
        {valid && (
          <span className="contact-form__valid-icon" aria-hidden="true">
            ✓
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="contact-form__feedback" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function Contact() {
  const [values, setValues] = useState(INITIAL)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const errors = validateContactForm(values)

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setTouched((t) => ({ ...t, [field]: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, subject: true, message: true })
    if (Object.keys(errors).length > 0) return
    setSubmitted(true)
    setValues(INITIAL)
    setTouched({})
  }

  const fieldClass = (field) => {
    const base = "contact-form__input"
    if (touched[field] && errors[field]) return `${base} ${base}--invalid`
    if (touched[field] && !errors[field]) return `${base} ${base}--valid`
    return base
  }

  return (
    <div className="contact">
      <div className="contact__hero">
        <h1 className="contact__title">Contact Us</h1>
        <p className="contact__subtitle">
          We&apos;re here to help. Send us a message and we&apos;ll get back to
          you as soon as possible.
        </p>
      </div>

      <div className="contact__content max-w-2xl mx-auto">
        {submitted && (
          <Alert
            type="success"
            message="Your message has been sent! We'll get back to you soon."
          />
        )}

        <form
          className="contact-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Contact form"
        >
          <FieldGroup
            id="contact-name"
            label="Full name"
            error={touched.name && errors.name}
            valid={touched.name && !errors.name}
          >
            <input
              id="contact-name"
              type="text"
              className={fieldClass("name")}
              placeholder="Jane Doe"
              autoComplete="name"
              value={values.name}
              onChange={set("name")}
              aria-describedby={
                touched.name && errors.name ? "contact-name-error" : undefined
              }
              aria-invalid={!!(touched.name && errors.name)}
            />
          </FieldGroup>

          <FieldGroup
            id="contact-email"
            label="Email address"
            error={touched.email && errors.email}
            valid={touched.email && !errors.email}
          >
            <input
              id="contact-email"
              type="email"
              className={fieldClass("email")}
              placeholder="jane@example.com"
              autoComplete="email"
              value={values.email}
              onChange={set("email")}
              aria-describedby={
                touched.email && errors.email
                  ? "contact-email-error"
                  : undefined
              }
              aria-invalid={!!(touched.email && errors.email)}
            />
          </FieldGroup>

          <FieldGroup
            id="contact-subject"
            label="Subject"
            error={touched.subject && errors.subject}
            valid={touched.subject && !errors.subject}
          >
            <input
              id="contact-subject"
              type="text"
              className={fieldClass("subject")}
              placeholder="How can we help?"
              value={values.subject}
              onChange={set("subject")}
              aria-describedby={
                touched.subject && errors.subject
                  ? "contact-subject-error"
                  : undefined
              }
              aria-invalid={!!(touched.subject && errors.subject)}
            />
          </FieldGroup>

          <FieldGroup
            id="contact-message"
            label="Message"
            error={touched.message && errors.message}
            valid={touched.message && !errors.message}
          >
            <textarea
              id="contact-message"
              className={`${fieldClass("message")} contact-form__textarea`}
              placeholder="Write your message here…"
              rows={5}
              value={values.message}
              onChange={set("message")}
              aria-describedby={
                touched.message && errors.message
                  ? "contact-message-error"
                  : undefined
              }
              aria-invalid={!!(touched.message && errors.message)}
            />
          </FieldGroup>

          <button type="submit" className="contact-form__submit">
            Send message
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact
