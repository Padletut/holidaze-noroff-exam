import { Link } from "react-router-dom"
import StarRating from "./StarRating"

function VenueCard({ venue }) {
  const { id, name, media, price, maxGuests, rating, location } = venue

  const image = media?.[0]
  const city = location?.city || ""
  const country = location?.country || ""
  const locationLabel = [city, country].filter(Boolean).join(", ")

  return (
    <Link to={`/venue/${id}`} className="venue-card">
      <div className="venue-card__image-wrapper">
        <img
          src={image?.url || "/placeholder.jpg"}
          alt={image?.alt || name}
          className="venue-card__image"
        />
      </div>
      <div className="venue-card__body">
        <h3 className="venue-card__name">{name}</h3>
        {locationLabel && (
          <p className="venue-card__location">{locationLabel}</p>
        )}
        <p className="venue-card__price">
          From <span className="venue-card__price-value">${price}</span>/night
        </p>
        <p className="venue-card__guests">
          <span className="venue-card__guests-icon" aria-hidden="true">
            &#128100;
          </span>{" "}
          {maxGuests} {maxGuests === 1 ? "Guest" : "Guests"}n
        </p>
        <StarRating rating={rating} />
      </div>
    </Link>
  )
}

export default VenueCard
