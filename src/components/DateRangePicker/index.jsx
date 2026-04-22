import { useEffect, useRef, useState } from "react"
import {
  toDateStr,
  formatDisplay,
  getDaysInMonth,
  getFirstWeekday,
} from "../../utils/dateUtils.mjs"

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const DAY_NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

function DateRangePicker({ checkIn, checkOut, onChange }) {
  const today = new Date()
  const todayStr = toDateStr(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )

  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [hoverDate, setHoverDate] = useState(null)
  const containerRef = useRef(null)

  // true = checkIn chosen, waiting for checkOut
  const selectingEnd = Boolean(checkIn && !checkOut)

  // Close popover on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setHoverDate(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const handleDayClick = (dateStr) => {
    if (dateStr < todayStr) return

    if (!checkIn || (checkIn && checkOut)) {
      // Start fresh selection
      onChange({ checkIn: dateStr, checkOut: "" })
    } else {
      // Second click
      if (dateStr === checkIn) {
        onChange({ checkIn: "", checkOut: "" })
      } else if (dateStr < checkIn) {
        onChange({ checkIn: dateStr, checkOut: checkIn })
        setOpen(false)
        setHoverDate(null)
      } else {
        onChange({ checkIn, checkOut: dateStr })
        setOpen(false)
        setHoverDate(null)
      }
    }
  }

  const prevMonth = () => {
    const prevMonthYear = viewMonth === 0 ? viewYear - 1 : viewYear
    const prevMonthIndex = viewMonth === 0 ? 11 : viewMonth - 1
    const firstOfPrevMonth = toDateStr(prevMonthYear, prevMonthIndex, 1)
    // Don't go before current month
    const firstOfCurrentMonth = toDateStr(
      today.getFullYear(),
      today.getMonth(),
      1,
    )
    if (firstOfPrevMonth < firstOfCurrentMonth) return
    setViewYear(prevMonthYear)
    setViewMonth(prevMonthIndex)
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const isAtMinMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth()

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth)
    const firstWeekday = getFirstWeekday(viewYear, viewMonth)
    const cells = []

    // Empty cells before first day
    for (let i = 0; i < firstWeekday; i++) {
      cells.push(<div key={`e${i}`} className="drp__day drp__day--empty" />)
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = toDateStr(viewYear, viewMonth, d)
      const isPast = dateStr < todayStr

      const effectiveEnd = selectingEnd && hoverDate ? hoverDate : checkOut
      const lo =
        checkIn && effectiveEnd && checkIn < effectiveEnd
          ? checkIn
          : effectiveEnd
      const hi =
        checkIn && effectiveEnd && checkIn < effectiveEnd
          ? effectiveEnd
          : checkIn

      const isStart = dateStr === checkIn
      const isEnd = dateStr === checkOut
      const isHoverEnd = selectingEnd && dateStr === hoverDate
      const inRange = lo && hi && dateStr > lo && dateStr < hi
      const isToday = dateStr === todayStr

      const cls = [
        "drp__day",
        isPast && "drp__day--past",
        isStart && "drp__day--start",
        (isEnd || isHoverEnd) && "drp__day--end",
        inRange && "drp__day--in-range",
        isToday && !isStart && !isEnd && "drp__day--today",
        !isPast && "drp__day--available",
      ]
        .filter(Boolean)
        .join(" ")

      cells.push(
        <button
          key={dateStr}
          type="button"
          className={cls}
          onClick={() => handleDayClick(dateStr)}
          onMouseEnter={() => selectingEnd && setHoverDate(dateStr)}
          onMouseLeave={() => selectingEnd && setHoverDate(null)}
          disabled={isPast}
          aria-label={dateStr}
          aria-pressed={isStart || isEnd}
        >
          {d}
        </button>,
      )
    }
    return cells
  }

  const displayValue =
    checkIn && checkOut
      ? `${formatDisplay(checkIn)} – ${formatDisplay(checkOut)}`
      : checkIn
        ? `${formatDisplay(checkIn)} – ?`
        : null

  return (
    <div className="drp" ref={containerRef}>
      <button
        type="button"
        className={`drp__trigger${open ? " drp__trigger--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="drp__trigger-icon" aria-hidden="true">
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
        <span
          className={`drp__trigger-text${!displayValue ? " drp__trigger-text--placeholder" : ""}`}
        >
          {displayValue ?? "Check In – Out"}
        </span>
      </button>

      {open && (
        <div
          className="drp__popover"
          role="dialog"
          aria-label="Select check-in and check-out dates"
        >
          <div className="drp__nav">
            <button
              type="button"
              className="drp__nav-btn"
              onClick={prevMonth}
              aria-label="Previous month"
              disabled={isAtMinMonth}
            >
              ‹
            </button>
            <span className="drp__month-label">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              className="drp__nav-btn"
              onClick={nextMonth}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="drp__day-names" aria-hidden="true">
            {DAY_NAMES.map((n) => (
              <div key={n} className="drp__day-name">
                {n}
              </div>
            ))}
          </div>

          <div className="drp__grid">{renderDays()}</div>

          <div className="drp__hint">
            {!checkIn && "Select check-in date"}
            {checkIn && !checkOut && "Select check-out date"}
            {checkIn && checkOut && (
              <button
                type="button"
                className="drp__clear"
                onClick={() => {
                  onChange({ checkIn: "", checkOut: "" })
                  setHoverDate(null)
                }}
              >
                Clear dates
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
