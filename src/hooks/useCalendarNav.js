import { useState } from "react"
import { toDateStr } from "../utils/dateUtils.mjs"

/**
 * Manages month-navigation state for a calendar component.
 *
 * Provides the current view year/month, helpers to move forward and backward
 * one month, a flag indicating whether the view is already at the earliest
 * allowed month (current month), and a pre-computed today string.
 *
 * @returns {{
 *   viewYear: number,
 *   viewMonth: number,
 *   prevMonth: () => void,
 *   nextMonth: () => void,
 *   isAtMinMonth: boolean,
 *   todayStr: string,
 * }}
 */
function useCalendarNav() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const isAtMinMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth()

  const prevMonth = () => {
    if (isAtMinMonth) return
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const todayStr = toDateStr(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )

  return { viewYear, viewMonth, prevMonth, nextMonth, isAtMinMonth, todayStr }
}

export default useCalendarNav
