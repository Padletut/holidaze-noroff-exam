function StarRating({ rating }) {
  const maxStars = 5
  const filled = Math.round(rating)
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
