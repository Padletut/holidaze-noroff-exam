import { Link } from "react-router-dom"
import { formatDateRange } from "../../utils/dateUtils.mjs"

function BookingCard({ booking }) {
  const venue = booking.venue
  const image = venue?.media?.[0]

  return (
    <li className="booking-card">
      <Link to={`/venue/${venue?.id}`} className="booking-card__image-link">
        <img
          src={image?.url || "/placeholder.jpg"}
          alt={image?.alt || venue?.name || "Venue"}
          className="booking-card__image"
        />
      </Link>
      <div className="booking-card__body">
        <Link to={`/venue/${venue?.id}`} className="booking-card__name-link">
          <h2 className="booking-card__name">
            {venue?.name || "Unknown venue"}
          </h2>
        </Link>
        <p className="booking-card__dates">
          <span className="booking-card__icon" aria-hidden="true">
            &#128197;
          </span>
          {formatDateRange(booking.dateFrom, booking.dateTo)}
        </p>
        <p className="booking-card__guests">
          <span className="booking-card__icon" aria-hidden="true">
            &#128101;
          </span>
          {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
        </p>
      </div>
    </li>
  )
}

export default BookingCard
