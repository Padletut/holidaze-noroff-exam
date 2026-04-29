const AMENITIES = [
  { key: "wifi", label: "WiFi", icon: "📶" },
  { key: "parking", label: "Parking", icon: "🅿" },
  { key: "breakfast", label: "Breakfast", icon: "☕" },
  { key: "pets", label: "Pets allowed", icon: "🐾" },
]

function VenueAmenities({ values, onToggle }) {
  return (
    <>
      <p className="venue-form-card__label venue-form-card__label--static">
        Amenities
      </p>
      <div className="venue-form-card__amenities">
        {AMENITIES.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={`venue-form-card__amenity-chip${values[key] ? " venue-form-card__amenity-chip--active" : ""}`}
          >
            <span aria-hidden="true">{icon}</span> {label}
          </button>
        ))}
      </div>
    </>
  )
}

export default VenueAmenities
