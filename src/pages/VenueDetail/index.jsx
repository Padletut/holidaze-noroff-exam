import "../../styles/index.scss"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { getVenueById } from "../../api/venues/getVenueById.mjs"
import LoadingSpinner from "../../components/LoadingSpinner"
import BookingCalendar from "./BookingCalendar"
import Alert from "../../components/Alert"

function VenueDetail() {
  const { id } = useParams()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imgIndex, setImgIndex] = useState(0)
  const touchStartX = useRef(null)

  useEffect(() => {
    getVenueById(id)
      .then((data) => setVenue(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error) return <Alert type="error" message={error} />
  if (!venue) return null

  const {
    name,
    description,
    media,
    price,
    maxGuests,
    rating,
    meta,
    location,
    bookings,
  } = venue
  const locationLabel = [location?.city, location?.country]
    .filter(Boolean)
    .join(", ")
  const images = media?.length
    ? media
    : [{ url: "/placeholder.jpg", alt: name }]

  const amenities = [
    meta?.wifi && { label: "WiFi", icon: "📶" },
    meta?.parking && { label: "Parking", icon: "🅿" },
    meta?.breakfast && { label: "Breakfast", icon: "☕" },
    meta?.pets && { label: "Pets", icon: "🐾" },
  ].filter(Boolean)

  return (
    <main className="venue-detail">
      {/* Image slider */}
      <div
        className="venue-detail__gallery"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return
          const diff = touchStartX.current - e.changedTouches[0].clientX
          touchStartX.current = null
          if (Math.abs(diff) < 40) return
          if (diff > 0) {
            setImgIndex((i) => (i + 1) % images.length)
          } else {
            setImgIndex((i) => (i - 1 + images.length) % images.length)
          }
        }}
      >
        <img
          src={images[imgIndex]?.url}
          alt={images[imgIndex]?.alt || name}
          className="venue-detail__gallery-img"
        />
        {images.length > 1 && (
          <>
            <button
              className="venue-detail__gallery-arrow venue-detail__gallery-arrow--prev"
              onClick={() =>
                setImgIndex((i) => (i - 1 + images.length) % images.length)
              }
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="venue-detail__gallery-arrow venue-detail__gallery-arrow--next"
              onClick={() => setImgIndex((i) => (i + 1) % images.length)}
              aria-label="Next image"
            >
              ›
            </button>
            <span className="venue-detail__gallery-count" aria-live="polite">
              {imgIndex + 1} / {images.length}
            </span>
            <div className="venue-detail__gallery-dots" aria-hidden="true">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`venue-detail__gallery-dot${
                    i === imgIndex ? " venue-detail__gallery-dot--active" : ""
                  }`}
                  onClick={() => setImgIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="venue-detail__body">
        {/* Header */}
        <h1 className="venue-detail__name">{name}</h1>
        {locationLabel && (
          <p className="venue-detail__location">{locationLabel}</p>
        )}

        <div className="venue-detail__meta-row">
          <span className="venue-detail__price">
            <strong>${price}</strong> / night
          </span>
          <span
            className="venue-detail__rating"
            aria-label={`Rating: ${rating} out of 5`}
          >
            {"★".repeat(Math.round(rating))}
            {"☆".repeat(5 - Math.round(rating))}
            <span className="venue-detail__rating-value">{rating}</span>
          </span>
        </div>

        <p className="venue-detail__guests">
          <span aria-hidden="true">👤</span> Guests: {maxGuests}
        </p>

        {/* Description */}
        {description && (
          <section className="venue-detail__section">
            <h2 className="venue-detail__section-title">Description</h2>
            <p className="venue-detail__description">{description}</p>
          </section>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <section className="venue-detail__section">
            <h2 className="venue-detail__section-title">Amenities</h2>
            <ul className="venue-detail__amenities">
              {amenities.map(({ label, icon }) => (
                <li key={label} className="venue-detail__amenity">
                  <span aria-hidden="true">{icon}</span> {label}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Booking calendar */}
        <section className="venue-detail__section">
          <h2 className="venue-detail__section-title">Availability</h2>
          <BookingCalendar
            bookings={bookings ?? []}
            maxGuests={maxGuests}
            pricePerNight={price}
          />
        </section>
      </div>
    </main>
  )
}

export default VenueDetail
