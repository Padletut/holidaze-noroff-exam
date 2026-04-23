import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  toDateStr,
  getDaysInMonth,
  getFirstWeekday,
  formatDisplay,
  MONTH_NAMES,
  DAY_NAMES,
} from "../../utils/dateUtils.mjs"
import useCalendarNav from "../../hooks/useCalendarNav"
import { createBooking } from "../../api/bookings/createBooking.mjs"
import { updateBooking } from "../../api/bookings/updateBooking.mjs"
import { deleteBooking } from "../../api/bookings/deleteBooking.mjs"
import { loadStorage } from "../../utils/loadStorage.mjs"
import { isBooked } from "../../utils/isBooked.mjs"
import { rangeOverlapsBooking } from "../../utils/rangeOverlapsBooking.mjs"

/**
 * Inline booking calendar showing availability and letting the user pick a date range.
 *
 * @param {Object} props
 * @param {Array<{dateFrom: string, dateTo: string, guests: number}>} props.bookings - Existing bookings.
 * @param {number} props.maxGuests - Maximum allowed guests for this venue.
 * @param {number} props.pricePerNight - Price per night in USD.
 * @param {string} props.venueId - The venue ID used when creating a booking.
 * @param {string} props.venueName - The venue name passed to the confirmation page.
 * @param {Object|null} props.userBooking - Existing booking by the logged-in user, if any.
 * @returns {JSX.Element}
 */
function BookingCalendar({
  bookings,
  maxGuests,
  pricePerNight,
  venueId,
  venueName,
  userBooking,
}) {
  const { viewYear, viewMonth, prevMonth, nextMonth, isAtMinMonth, todayStr } =
    useCalendarNav()
  const navigate = useNavigate()

  const [checkIn, setCheckIn] = useState(
    userBooking ? userBooking.dateFrom.slice(0, 10) : "",
  )
  const [checkOut, setCheckOut] = useState(
    userBooking ? userBooking.dateTo.slice(0, 10) : "",
  )
  const [hoverDate, setHoverDate] = useState(null)
  const [guests, setGuests] = useState(userBooking ? userBooking.guests : 1)
  const [rangeError, setRangeError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // When editing, exclude the user's own booking from the blocked-dates check
  const otherBookings = userBooking
    ? bookings.filter((b) => b.id !== userBooking.id)
    : bookings

  const selectingEnd = Boolean(checkIn && !checkOut)

  const handleDayClick = (dateStr) => {
    if (dateStr < todayStr) return
    if (isBooked(dateStr, otherBookings)) return

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr)
      setCheckOut("")
      setRangeError("")
    } else {
      const [lo, hi] =
        dateStr < checkIn ? [dateStr, checkIn] : [checkIn, dateStr]
      if (rangeOverlapsBooking(lo, hi, otherBookings)) {
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
      const booked = isBooked(dateStr, otherBookings)
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

          {userBooking ? (
            <>
              <button
                className="bc__book-btn"
                type="button"
                disabled={submitting}
                onClick={async () => {
                  setSubmitError("")
                  setSubmitting(true)
                  const prev = {
                    dateFrom: userBooking.dateFrom,
                    dateTo: userBooking.dateTo,
                    guests: userBooking.guests,
                  }
                  try {
                    const updated = await updateBooking(userBooking.id, {
                      dateFrom: new Date(checkIn).toISOString(),
                      dateTo: new Date(checkOut).toISOString(),
                      guests,
                    })
                    navigate("/booking-confirmed", {
                      state: {
                        mode: "updated",
                        booking: updated,
                        venue: { name: venueName, price: pricePerNight },
                        prev,
                      },
                    })
                  } catch (err) {
                    setSubmitError(err.message)
                    setSubmitting(false)
                  }
                }}
              >
                {submitting ? "Saving…" : "Update booking"}
              </button>

              {!showCancelConfirm ? (
                <button
                  className="bc__cancel-btn"
                  type="button"
                  disabled={submitting}
                  onClick={() => setShowCancelConfirm(true)}
                >
                  Cancel booking
                </button>
              ) : (
                <div className="bc__cancel-confirm">
                  <p>Are you sure you want to cancel this booking?</p>
                  <div className="bc__cancel-confirm-actions">
                    <button
                      className="bc__cancel-btn"
                      type="button"
                      disabled={submitting}
                      onClick={async () => {
                        setSubmitting(true)
                        try {
                          await deleteBooking(userBooking.id)
                          navigate("/bookings")
                        } catch (err) {
                          setSubmitError(err.message)
                          setSubmitting(false)
                          setShowCancelConfirm(false)
                        }
                      }}
                    >
                      {submitting ? "Cancelling…" : "Yes, cancel"}
                    </button>
                    <button
                      className="bc__book-btn"
                      type="button"
                      onClick={() => setShowCancelConfirm(false)}
                    >
                      Keep booking
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : loadStorage("profile") ? (
            <button
              className="bc__book-btn"
              type="button"
              disabled={submitting}
              onClick={async () => {
                setSubmitError("")
                setSubmitting(true)
                try {
                  const booking = await createBooking({
                    dateFrom: new Date(checkIn).toISOString(),
                    dateTo: new Date(checkOut).toISOString(),
                    guests,
                    venueId,
                  })
                  navigate("/booking-confirmed", {
                    state: {
                      mode: "created",
                      booking,
                      venue: { name: venueName, price: pricePerNight },
                    },
                  })
                } catch (err) {
                  setSubmitError(err.message)
                  setSubmitting(false)
                }
              }}
            >
              {submitting ? "Booking…" : "Book now"}
            </button>
          ) : (
            <p className="bc__login-prompt">
              <Link to="/authenticate" className="bc__login-link">
                Sign in
              </Link>{" "}
              or{" "}
              <Link to="/authenticate" className="bc__login-link">
                create an account
              </Link>{" "}
              to book this venue.
            </p>
          )}

          {submitError && (
            <p className="bc__submit-error" role="alert">
              {submitError}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default BookingCalendar
