import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/index.scss"
import { getProfileVenues } from "../../api/profiles/getProfileVenues.mjs"
import { loadStorage } from "../../utils/loadStorage.mjs"
import LoadingSpinner from "../../components/LoadingSpinner"
import Alert from "../../components/Alert"

function formatDateRange(dateFrom, dateTo) {
  const from = new Date(dateFrom)
  const to = new Date(dateTo)
  const opts = { day: "numeric", month: "short" }
  return `${from.toLocaleDateString("en-GB", opts)} – ${to.toLocaleDateString("en-GB", opts)}`
}

function VenueBookings() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const storedProfile = loadStorage("profile")

  useEffect(() => {
    if (!storedProfile) {
      navigate("/authenticate")
      return
    }

    getProfileVenues(storedProfile.name)
      .then((data) => setVenues(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <Alert type="error" message={error} />

  const allBookings = venues.flatMap((venue) =>
    (venue.bookings ?? []).map((booking) => ({
      ...booking,
      venueName: venue.name,
    })),
  )

  return (
    <div className="venue-bookings">
      <h1 className="venue-bookings__title">Venue Bookings</h1>

      {allBookings.length === 0 ? (
        <p className="venue-bookings__empty">No bookings on your venues yet.</p>
      ) : (
        <div className="venue-bookings__grid">
          {allBookings.map((booking) => (
            <div key={booking.id} className="venue-booking-card">
              <p className="venue-booking-card__venue">{booking.venueName}</p>
              <p className="venue-booking-card__row">
                <svg
                  className="venue-booking-card__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDateRange(booking.dateFrom, booking.dateTo)}
              </p>
              <p className="venue-booking-card__row">
                <svg
                  className="venue-booking-card__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {booking.customer?.name ?? "Unknown guest"}
              </p>
              <p className="venue-booking-card__row">
                <svg
                  className="venue-booking-card__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VenueBookings
