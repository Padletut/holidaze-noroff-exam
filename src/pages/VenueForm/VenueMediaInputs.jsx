function VenueMediaInputs({ mediaItems, onChange, onAdd, onRemove }) {
  return (
    <>
      {mediaItems.map((item, index) => (
        <div key={index} className="venue-form-card__media-group">
          <input
            className="venue-form-card__input"
            type="url"
            placeholder="Media URL"
            value={item.url}
            onChange={(e) => onChange(index, "url", e.target.value)}
          />
          <input
            className="venue-form-card__input"
            type="text"
            placeholder="Picture description (optional)"
            value={item.alt}
            onChange={(e) => onChange(index, "alt", e.target.value)}
          />
          {mediaItems.length > 1 && (
            <button
              type="button"
              className="venue-form-card__btn venue-form-card__btn--remove"
              onClick={() => onRemove(index)}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="venue-form-card__btn venue-form-card__btn--add-media"
        onClick={onAdd}
      >
        Add Media
      </button>
    </>
  )
}

export default VenueMediaInputs
