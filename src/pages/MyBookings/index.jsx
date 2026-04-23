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

  const storedProfile = loadStorage("profile")

  useEffect(() => {
    if (!storedProfile) {
      navigate("/authenticate")
      return
    }

    getProfileBookings(storedProfile.name)
      .then((data) => setBookings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <Alert type="error" message={error} />

  return (
    <div className="my-bookings">
      <h1 className="my-bookings__title">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="my-bookings__empty">You have no bookings yet.</p>
      ) : (
        <ul className="my-bookings__list">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyBookings
