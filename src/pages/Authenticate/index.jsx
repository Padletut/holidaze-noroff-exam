import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import "../../styles/index.scss"
import validateLoginForm from "../../utils/validateLoginForm"
import validateRegisterForm from "../../utils/validateRegisterForm"
import { login } from "../../api/auth/login"
import { register } from "../../api/auth/register"
import Alert from "../../components/Alert"

function FieldGroup({
  id,
  label,
  type,
  autoComplete,
  value,
  onChange,
  error,
  valid,
}) {
  return (
    <div className="auth-form__field">
      <input
        id={id}
        type={type}
        className={`auth-form__input${error ? " auth-form__input--invalid" : ""}${valid ? " auth-form__input--valid" : ""}`}
        placeholder=" "
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
      />
      <label htmlFor={id} className="auth-form__label">
        {label}
      </label>
      {valid && (
        <span className="auth-form__valid-icon" aria-hidden="true">
          ✓
        </span>
      )}
      {error && (
        <p id={`${id}-error`} className="auth-form__feedback">
          {error}
        </p>
      )}
    </div>
  )
}

function LoginForm({ onSwitch, onSuccess }) {
  const [values, setValues] = useState({ email: "", password: "" })
  const [touched, setTouched] = useState({})
  const [apiError, setApiError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const errors = validateLoginForm(values)

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setTouched((t) => ({ ...t, [field]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (Object.keys(errors).length > 0) return

    setApiError(null)
    setSubmitting(true)
    try {
      await login(values)
      onSuccess("You are now logged in! Taking you to your account…")
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSubmitting(false)
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
            label="Email (stud.noroff.no)"
            type="email"
            autoComplete="email"
            {...fieldProps("email")}
          />
          <FieldGroup
            id="login-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            {...fieldProps("password")}
          />
          <Alert type="error" message={apiError} />
          <button
            type="submit"
            className="auth-form__btn"
            disabled={submitting}
          >
            {submitting ? "Logging in…" : "Login"}
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

function RegisterForm({ onSwitch, onSuccess }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    venueManager: false,
  })
  const [touched, setTouched] = useState({})
  const [apiError, setApiError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const errors = validateRegisterForm(values)

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setTouched((t) => ({ ...t, [field]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    })
    if (Object.keys(errors).length > 0) return

    setApiError(null)
    setSubmitting(true)
    try {
      await register(values)
      await login({ email: values.email, password: values.password })
      onSuccess("Account created! Taking you to your account…")
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSubmitting(false)
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
            label="Your name"
            type="text"
            autoComplete="name"
            {...fieldProps("name")}
          />
          <FieldGroup
            id="register-email"
            label="Email (stud.noroff.no)"
            type="email"
            autoComplete="email"
            {...fieldProps("email")}
          />
          <FieldGroup
            id="register-password"
            label="Password"
            type="password"
            autoComplete="new-password"
            {...fieldProps("password")}
          />
          <FieldGroup
            id="register-confirm-password"
            label="Confirm password"
            type="password"
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
          <Alert type="error" message={apiError} />
          <button
            type="submit"
            className="auth-form__btn"
            disabled={submitting}
          >
            {submitting ? "Creating account…" : "Sign Up"}
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
  const [searchParams, setSearchParams] = useSearchParams()
  const [successMessage, setSuccessMessage] = useState(null)
  const navigate = useNavigate()
  const view = useMemo(() => {
    const mode = searchParams.get("mode")
    return mode === "register" ? "register" : "login"
  }, [searchParams])

  const setView = (nextView) => {
    setSearchParams(nextView === "register" ? { mode: "register" } : {})
  }

  const handleSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      navigate("/account")
    }, 2000)
  }

  if (successMessage) {
    return (
      <div className="auth-page">
        <div className="auth-success">
          <Alert type="success" message={successMessage} />
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      {view === "login" ? (
        <LoginForm
          onSwitch={() => setView("register")}
          onSuccess={handleSuccess}
        />
      ) : (
        <RegisterForm
          onSwitch={() => setView("login")}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}

export default Authenticate
