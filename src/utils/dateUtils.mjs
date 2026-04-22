export function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export function formatDisplay(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split("-")
  return `${d}.${m}.${y}`
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

// Returns Mon-first weekday index (Mon=0 … Sun=6)
export function getFirstWeekday(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7
}
