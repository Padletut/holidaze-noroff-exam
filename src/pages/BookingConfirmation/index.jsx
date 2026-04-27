import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import "../../styles/index.scss"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function displayDate(isoStr) {
  const d = new Date(isoStr)
  return `${d.getDate()}. ${MONTHS[d.getMonth()]}`
}

function nightsBetween(from, to) {
  return Math.round((new Date(to) - new Date(from)) / 86400000)
}

function BookingConfirmation() {
  const { state } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state?.booking) navigate("/bookings", { replace: true })
  }, [state, navigate])

  if (!state?.booking) return null

  const { mode, booking, venue, prev } = state
  const nights = nightsBetween(booking.dateFrom, booking.dateTo)
  const totalPrice = nights * (venue?.price ?? 0)

  const isCreated = mode === "created"
  const isUpdated = mode === "updated"

  const changedFields = []
  if (isUpdated && prev) {
    if (prev.dateFrom !== booking.dateFrom)
      changedFields.push({
        icon: "📅",
        label: "Check-in",
        from: displayDate(prev.dateFrom),
        to: displayDate(booking.dateFrom),
      })
    if (prev.dateTo !== booking.dateTo)
      changedFields.push({
        icon: "📅",
        label: "Check-out",
        from: displayDate(prev.dateTo),
        to: displayDate(booking.dateTo),
      })
    if (prev.guests !== booking.guests)
      changedFields.push({
        icon: "👥",
        label: "Guests",
        from: String(prev.guests),
        to: String(booking.guests),
      })
  }

  return (
    <div className="booking-confirmation">
      <div className="booking-confirmation__card">
        <h1 className="booking-confirmation__title">
          {isCreated
            ? "Thank you for your booking!"
            : "Booking updated successfully"}
        </h1>
        <p className="booking-confirmation__subtitle">
          {isCreated
            ? `Your ${venue?.name ?? "stay"} is confirmed. We're looking forward to welcoming you.`
            : "Your changes have been saved. Here's an updated overview of your stay."}
        </p>

        {isUpdated && changedFields.length > 0 && (
          <div className="booking-confirmation__section">
            <h2 className="booking-confirmation__section-title">
              What&apos;s changed
            </h2>
            <ul className="booking-confirmation__change-list">
              {changedFields.map(({ icon, label, from, to }) => (
                <li key={label} className="booking-confirmation__change-item">
                  <span
                    className="booking-confirmation__detail-icon"
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                  <div>
                    <span className="booking-confirmation__change-label">
                      {label}
                    </span>
                    <br />
                    <span className="booking-confirmation__change-values">
                      {from} <span aria-hidden="true">→</span>{" "}
                      <strong>{to}</strong>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="booking-confirmation__section">
          <h2 className="booking-confirmation__section-title">
            {isUpdated ? "Updated booking details" : "Booking details"}
          </h2>
          <ul className="booking-confirmation__details">
            <li className="booking-confirmation__detail-row">
              <span
                className="booking-confirmation__detail-icon"
                aria-hidden="true"
              >
                📅
              </span>
              <span className="booking-confirmation__detail-label">
                Check-in
              </span>
              <span className="booking-confirmation__detail-value">
                {displayDate(booking.dateFrom)}
              </span>
            </li>
            <li className="booking-confirmation__detail-row">
              <span
                className="booking-confirmation__detail-icon"
                aria-hidden="true"
              >
                📅
              </span>
              <span className="booking-confirmation__detail-label">
                Check-out
              </span>
              <span className="booking-confirmation__detail-value">
                {displayDate(booking.dateTo)}
              </span>
            </li>
            <li className="booking-confirmation__detail-row">
              <span
                className="booking-confirmation__detail-icon"
                aria-hidden="true"
              >
                👥
              </span>
              <span className="booking-confirmation__detail-label">
                {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
              </span>
            </li>
            <li className="booking-confirmation__detail-row">
              <span
                className="booking-confirmation__detail-icon"
                aria-hidden="true"
              >
                🌙
              </span>
              <span className="booking-confirmation__detail-label">
                {nights} {nights === 1 ? "Night" : "Nights"}
              </span>
            </li>
          </ul>

          {venue?.price != null && (
            <div className="booking-confirmation__total">
              <span>Total price</span>
              <span>{totalPrice}</span>
            </div>
          )}
        </div>

        <Link to="/bookings" className="booking-confirmation__btn">
          View booking
        </Link>
      </div>
    </div>
  )
}

export default BookingConfirmation
