import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/index.scss"
import { getProfileBookings } from "../../api/profiles/getProfileBookings"
import { loadStorage } from "../../utils/loadStorage.mjs"
import LoadingSpinner from "../../components/LoadingSpinner"
import Alert from "../../components/Alert"
import BookingCard from "../../components/BookingCard"

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const profileName = loadStorage("profile")?.name ?? null

  useEffect(() => {
    if (!profileName) {
      navigate("/authenticate")
      return
    }

    const controller = new AbortController()

    async function loadBookings() {
      try {
        const data = await getProfileBookings(profileName, {
          signal: controller.signal,
        })
        setBookings(data)
      } catch (err) {
        if (err.name === "AbortError") return
        setError(err.message)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadBookings()

    return () => controller.abort()
  }, [navigate, profileName])

  if (loading) return <LoadingSpinner />
  if (error) return <Alert type="error" message={error} />

  const today = new Date().toISOString().slice(0, 10)
  const upcomingBookings = bookings
    .filter((booking) => booking.dateFrom?.slice(0, 10) >= today)
    .sort((a, b) => a.dateFrom.localeCompare(b.dateFrom))

  return (
    <div className="my-bookings">
      <h1 className="my-bookings__title">My Upcoming Bookings</h1>

      {upcomingBookings.length === 0 ? (
        <p className="my-bookings__empty">You have no upcoming bookings.</p>
      ) : (
        <ul className="my-bookings__list">
          {upcomingBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyBookings
