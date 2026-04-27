function VenueDeleteConfirm({ deleting, onConfirm, onCancel }) {
  return (
    <div className="venue-form-card__delete-confirm">
      <p className="venue-form-card__delete-confirm-text">
        Are you sure you want to delete this venue? This cannot be undone.
      </p>
      <div className="venue-form-card__delete-confirm-actions">
        <button
          type="button"
          className="venue-form-card__btn venue-form-card__btn--delete-confirm"
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? "Deleting…" : "Yes, delete"}
        </button>
        <button
          type="button"
          className="venue-form-card__btn venue-form-card__btn--keep"
          onClick={onCancel}
          disabled={deleting}
        >
          Keep venue
        </button>
      </div>
    </div>
  )
}

export default VenueDeleteConfirm
