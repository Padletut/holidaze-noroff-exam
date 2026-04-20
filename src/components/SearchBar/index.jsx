import "../../styles/index.scss"

function SearchBar() {
  return (
    <div className="search-bar">
      <div className="search-bar__fields">
        <div className="search-bar__input-wrapper">
          <span className="search-bar__icon" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <input
            className="search-bar__input"
            type="text"
            placeholder="Location"
            aria-label="Location"
          />
        </div>

        <div className="search-bar__input-wrapper">
          <span className="search-bar__icon" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <input
            className="search-bar__input"
            type="number"
            min="1"
            placeholder="1 guest"
            aria-label="Number of guests"
          />
        </div>
      </div>

      <div className="search-bar__input-wrapper search-bar__input-wrapper--full">
        <span className="search-bar__icon" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        <input
          className="search-bar__input"
          type="text"
          placeholder="Check In - Out"
          aria-label="Check in and check out dates"
        />
      </div>

      <button className="search-bar__button" type="button">
        Search
      </button>
    </div>
  )
}

export default SearchBar
