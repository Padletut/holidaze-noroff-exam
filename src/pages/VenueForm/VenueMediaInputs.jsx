function VenueMediaInputs({ mediaItems, onChange, onAdd, onRemove }) {
  return (
    <>
      {mediaItems.map((item, index) => (
        <div key={index} className="venue-form-card__media-group">
          <div className="venue-form-card__field">
            <input
              className="venue-form-card__input"
              type="url"
              id={`media-url-${index}`}
              placeholder=" "
              value={item.url}
              onChange={(e) => onChange(index, "url", e.target.value)}
            />
            <label
              className="venue-form-card__label"
              htmlFor={`media-url-${index}`}
            >
              Media URL
            </label>
          </div>
          <div className="venue-form-card__field">
            <input
              className="venue-form-card__input"
              type="text"
              id={`media-alt-${index}`}
              placeholder=" "
              value={item.alt}
              onChange={(e) => onChange(index, "alt", e.target.value)}
            />
            <label
              className="venue-form-card__label"
              htmlFor={`media-alt-${index}`}
            >
              Picture description (optional)
            </label>
          </div>
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
