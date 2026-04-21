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
          className={`form-control${error ? " form-control--invalid" : ""}`}
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
  const [errors, setErrors] = useState({})

  const set = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }))

  const validate = () => validateLoginForm(values)

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      // TODO: call login API
    }
  }

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
            value={values.email}
            onChange={set("email")}
            error={errors.email}
          />
          <FieldGroup
            id="login-password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={values.password}
            onChange={set("password")}
            error={errors.password}
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
  const [errors, setErrors] = useState({})

  const set = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }))

  const validate = () => validateRegisterForm(values)

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      // TODO: call register API
    }
  }

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
            value={values.name}
            onChange={set("name")}
            error={errors.name}
          />
          <FieldGroup
            id="register-email"
            type="email"
            placeholder="Email (stud.noroff.no)"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            error={errors.email}
          />
          <FieldGroup
            id="register-password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={values.password}
            onChange={set("password")}
            error={errors.password}
          />
          <FieldGroup
            id="register-confirm-password"
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={set("confirmPassword")}
            error={errors.confirmPassword}
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
