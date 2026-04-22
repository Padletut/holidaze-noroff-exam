import { useState } from "react"
import {
  toDateStr,
  getDaysInMonth,
  getFirstWeekday,
  formatDisplay,
  MONTH_NAMES,
  DAY_NAMES,
} from "../../utils/dateUtils.mjs"
import useCalendarNav from "../../hooks/useCalendarNav"

/**
 * Checks whether a date string falls within any booked period.
 *
 * @param {string} dateStr - ISO date string (YYYY-MM-DD) to check.
 * @param {Array<{dateFrom: string, dateTo: string}>} bookings - Array of booking objects.
 * @returns {boolean} True if the date is booked.
 */
function isBooked(dateStr, bookings) {
  return bookings.some(({ dateFrom, dateTo }) => {
    const from = dateFrom.slice(0, 10)
    const to = dateTo.slice(0, 10)
    return dateStr >= from && dateStr <= to
  })
}

/**
 * Checks whether selecting a range would overlap any existing booking.
 *
 * @param {string} from - ISO date string for range start.
 * @param {string} to - ISO date string for range end.
 * @param {Array<{dateFrom: string, dateTo: string}>} bookings - Existing bookings.
 * @returns {boolean} True if the range overlaps a booking.
 */
function rangeOverlapsBooking(from, to, bookings) {
  return bookings.some(({ dateFrom, dateTo }) => {
    const bFrom = dateFrom.slice(0, 10)
    const bTo = dateTo.slice(0, 10)
    return from <= bTo && to >= bFrom
  })
}

/**
 * Inline booking calendar showing availability and letting the user pick a date range.
 *
 * @param {Object} props
 * @param {Array<{dateFrom: string, dateTo: string, guests: number}>} props.bookings - Existing bookings.
 * @param {number} props.maxGuests - Maximum allowed guests for this venue.
 * @param {number} props.pricePerNight - Price per night in USD.
 * @returns {JSX.Element}
 */
function BookingCalendar({ bookings, maxGuests, pricePerNight }) {
  const { viewYear, viewMonth, prevMonth, nextMonth, isAtMinMonth, todayStr } =
    useCalendarNav()

  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [hoverDate, setHoverDate] = useState(null)
  const [guests, setGuests] = useState(1)
  const [rangeError, setRangeError] = useState("")

  const selectingEnd = Boolean(checkIn && !checkOut)

  const handleDayClick = (dateStr) => {
    if (dateStr < todayStr) return
    if (isBooked(dateStr, bookings)) return

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr)
      setCheckOut("")
      setRangeError("")
    } else {
      const [lo, hi] =
        dateStr < checkIn ? [dateStr, checkIn] : [checkIn, dateStr]
      if (rangeOverlapsBooking(lo, hi, bookings)) {
        setRangeError(
          "Selected range includes unavailable dates. Please choose different dates.",
        )
        setCheckIn("")
        setCheckOut("")
      } else {
        setCheckIn(lo)
        setCheckOut(hi)
        setRangeError("")
      }
    }
  }

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth)
    const firstWeekday = getFirstWeekday(viewYear, viewMonth)
    const cells = []

    for (let i = 0; i < firstWeekday; i++) {
      cells.push(<div key={`e${i}`} className="bc__day bc__day--empty" />)
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = toDateStr(viewYear, viewMonth, d)
      const isPast = dateStr < todayStr
      const booked = isBooked(dateStr, bookings)
      const disabled = isPast || booked

      const effectiveEnd = selectingEnd && hoverDate ? hoverDate : checkOut
      const lo =
        checkIn && effectiveEnd
          ? checkIn < effectiveEnd
            ? checkIn
            : effectiveEnd
          : null
      const hi =
        checkIn && effectiveEnd
          ? checkIn < effectiveEnd
            ? effectiveEnd
            : checkIn
          : null

      const isStart = dateStr === checkIn
      const isEnd = dateStr === checkOut
      const isHoverEnd = selectingEnd && dateStr === hoverDate && !booked
      const inRange = lo && hi && dateStr > lo && dateStr < hi && !booked
      const isToday = dateStr === todayStr

      const cls = [
        "bc__day",
        isPast && "bc__day--past",
        booked && "bc__day--booked",
        isStart && "bc__day--start",
        (isEnd || isHoverEnd) && "bc__day--end",
        inRange && "bc__day--in-range",
        isToday && !isStart && !isEnd && !booked && "bc__day--today",
        !disabled && "bc__day--available",
      ]
        .filter(Boolean)
        .join(" ")

      cells.push(
        <button
          key={dateStr}
          type="button"
          className={cls}
          onClick={() => handleDayClick(dateStr)}
          onMouseEnter={() => {
            if (selectingEnd && !booked) setHoverDate(dateStr)
          }}
          onMouseLeave={() => selectingEnd && setHoverDate(null)}
          disabled={disabled}
          aria-label={`${dateStr}${booked ? ", unavailable" : ""}`}
          aria-pressed={isStart || isEnd}
        >
          {d}
        </button>,
      )
    }

    return cells
  }

  const nights =
    checkIn && checkOut
      ? Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)
      : 0

  return (
    <div className="bc">
      <div className="bc__calendar">
        <div className="bc__nav">
          <button
            type="button"
            className="bc__nav-btn"
            onClick={prevMonth}
            disabled={isAtMinMonth}
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="bc__month-label">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            className="bc__nav-btn"
            onClick={nextMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className="bc__day-names" aria-hidden="true">
          {DAY_NAMES.map((n) => (
            <div key={n} className="bc__day-name">
              {n}
            </div>
          ))}
        </div>

        <div className="bc__grid">{renderDays()}</div>

        <p className="bc__hint">
          {rangeError
            ? rangeError
            : !checkIn
              ? "Select check-in date"
              : !checkOut
                ? "Select check-out date"
                : ""}
        </p>
      </div>

      {/* Guest selector */}
      <div className="bc__guests">
        <label className="bc__guests-label" htmlFor="bc-guests">
          Guests
        </label>
        <select
          id="bc-guests"
          className="bc__guests-select"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        >
          {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "Guest" : "Guests"}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      {checkIn && checkOut && (
        <div className="bc__summary">
          <div className="bc__summary-row">
            <span>Check-in</span>
            <span>{formatDisplay(checkIn)}</span>
          </div>
          <div className="bc__summary-row">
            <span>Check-out</span>
            <span>{formatDisplay(checkOut)}</span>
          </div>
          <div className="bc__summary-row">
            <span>
              {guests} {guests === 1 ? "Guest" : "Guests"}
            </span>
            <span>
              {nights} {nights === 1 ? "Night" : "Nights"}
            </span>
          </div>
          <div className="bc__summary-row bc__summary-row--total">
            <span>Total</span>
            <span>{nights * pricePerNight}</span>
          </div>
          <button className="bc__book-btn" type="button">
            Book
          </button>
        </div>
      )}
    </div>
  )
}

export default BookingCalendar
