import { useState } from "react"
import "../../styles/index.scss"
import validateLoginForm from "../../utils/validateLoginForm"
import validateRegisterForm from "../../utils/validateRegisterForm"

function FieldGroup({
  id,
  type,
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
  valid,
}) {
  return (
    <div className="auth-form__group">
      <label htmlFor={id} className="auth-form__label">
        {placeholder}
      </label>
      <div className="auth-form__input-wrapper">
        <input
          id={id}
          type={type}
          className={`form-control${error ? " form-control--invalid" : ""}${valid ? " form-control--valid" : ""}`}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
        />
        {error && (
          <span className="auth-form__invalid-icon" aria-hidden="true" />
        )}
        {valid && (
          <span className="auth-form__valid-icon" aria-hidden="true">
            ✓
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="auth-form__feedback">
          {error}
        </p>
      )}
    </div>
  )
}

function LoginForm({ onSwitch }) {
  const [values, setValues] = useState({ email: "", password: "" })
  const [touched, setTouched] = useState({})

  const errors = validateLoginForm(values)

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setTouched((t) => ({ ...t, [field]: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (Object.keys(errors).length === 0) {
      // TODO: call login API
    }
  }

  const fieldProps = (field) => ({
    value: values[field],
    onChange: set(field),
    error: touched[field] ? errors[field] : undefined,
    valid: touched[field] && !errors[field],
  })

  return (
    <div className="auth-card">
      <h1 className="auth-card__heading">Welcome back</h1>
      <div className="auth-card__form-box">
        <h2 className="auth-card__form-title">Login</h2>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <FieldGroup
            id="login-email"
            type="email"
            placeholder="Email (stud.noroff.no)"
            autoComplete="email"
            {...fieldProps("email")}
          />
          <FieldGroup
            id="login-password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            {...fieldProps("password")}
          />
          <button type="submit" className="auth-form__btn">
            Login
          </button>
        </form>
        <p className="auth-card__switch-text">
          Don&apos;t have an account yet?{" "}
          <button className="auth-card__switch-link" onClick={onSwitch}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}

function RegisterForm({ onSwitch }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    venueManager: false,
  })
  const [touched, setTouched] = useState({})

  const errors = validateRegisterForm(values)

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setTouched((t) => ({ ...t, [field]: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    })
    if (Object.keys(errors).length === 0) {
      // TODO: call register API
    }
  }

  const fieldProps = (field) => ({
    value: values[field],
    onChange: set(field),
    error: touched[field] ? errors[field] : undefined,
    valid: touched[field] && !errors[field],
  })

  return (
    <div className="auth-card">
      <h1 className="auth-card__heading">Start your next getaway</h1>
      <div className="auth-card__form-box">
        <h2 className="auth-card__form-title">Create account</h2>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <FieldGroup
            id="register-name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            {...fieldProps("name")}
          />
          <FieldGroup
            id="register-email"
            type="email"
            placeholder="Email (stud.noroff.no)"
            autoComplete="email"
            {...fieldProps("email")}
          />
          <FieldGroup
            id="register-password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            {...fieldProps("password")}
          />
          <FieldGroup
            id="register-confirm-password"
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
            {...fieldProps("confirmPassword")}
          />
          <div className="auth-form__checkbox-group">
            <input
              id="register-venue-manager"
              type="checkbox"
              className="auth-form__checkbox"
              checked={values.venueManager}
              onChange={(e) =>
                setValues((v) => ({ ...v, venueManager: e.target.checked }))
              }
            />
            <label
              htmlFor="register-venue-manager"
              className="auth-form__checkbox-label"
            >
              Register as Venue Manager
            </label>
          </div>
          <button type="submit" className="auth-form__btn">
            Sign Up
          </button>
        </form>
        <p className="auth-card__switch-text">
          Already have an account?{" "}
          <button className="auth-card__switch-link" onClick={onSwitch}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}

function Authenticate() {
  const [view, setView] = useState("login")

  return (
    <div className="auth-page">
      {view === "login" ? (
        <LoginForm onSwitch={() => setView("register")} />
      ) : (
        <RegisterForm onSwitch={() => setView("login")} />
      )}
    </div>
  )
}

export default Authenticate
