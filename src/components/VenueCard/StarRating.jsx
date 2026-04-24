function StarRating({ rating }) {
  const maxStars = 5
  const filled = Math.round(rating)

  if (rating === 0) {
    return (
      <div className="venue-card__stars" aria-label="New venue">
        <span className="venue-card__rating-new">⭐ New</span>
      </div>
    )
  }

  return (
    <div
      className="venue-card__stars"
      aria-label={`Rating: ${rating} out of 5`}
    >
      {Array.from({ length: maxStars }, (_, i) => (
        <span key={i} className={i < filled ? "star star--filled" : "star"}>
          ★
        </span>
      ))}
      <span className="venue-card__rating-value">{rating}</span>
    </div>
  )
}

export default StarRating
