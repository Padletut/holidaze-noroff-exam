import { useState } from "react"
import "../../styles/index.scss"
import DateRangePicker from "../DateRangePicker"

function SearchBar({ onSearch, onSubmit, initialValues = {} }) {
  const [query, setQuery] = useState(initialValues.query ?? "")
  const [guests, setGuests] = useState(initialValues.guests ?? "")
  const [checkIn, setCheckIn] = useState(initialValues.checkIn ?? "")
  const [checkOut, setCheckOut] = useState(initialValues.checkOut ?? "")

  const handleQueryChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch?.({ query: value, guests, checkIn, checkOut })
  }

  const handleGuestsChange = (e) => {
    const value = e.target.value
    setGuests(value)
    onSearch?.({ query, guests: value, checkIn, checkOut })
  }

  const handleDatesChange = ({
    checkIn: newCheckIn,
    checkOut: newCheckOut,
  }) => {
    setCheckIn(newCheckIn)
    setCheckOut(newCheckOut)
    onSearch?.({ query, guests, checkIn: newCheckIn, checkOut: newCheckOut })
  }

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
            aria-label="Search by location or name"
            value={query}
            onChange={handleQueryChange}
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
            value={guests}
            onChange={handleGuestsChange}
          />
        </div>
      </div>

      <DateRangePicker
        checkIn={checkIn}
        checkOut={checkOut}
        onChange={handleDatesChange}
      />

      <button
        className="search-bar__button"
        type="button"
        onClick={() => onSubmit?.({ query, guests, checkIn, checkOut })}
      >
        Search
      </button>
    </div>
  )
}

export default SearchBar
