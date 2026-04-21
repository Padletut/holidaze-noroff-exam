import { useState } from "react"

/**
 * @param {"success" | "error"} type
 * @param {string} message
 */
function Alert({ type = "error", message }) {
  const [dismissed, setDismissed] = useState(false)

  if (!message || dismissed) return null

  return (
    <div className={`alert alert--${type}`} role="alert" aria-live="polite">
      <span className="alert__message">{message}</span>
      <button
        className="alert__close"
        onClick={() => setDismissed(true)}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  )
}

export default Alert
