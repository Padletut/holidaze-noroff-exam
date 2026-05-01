import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../../styles/index.scss"
import { getProfileVenues } from "../../api/profiles/getProfileVenues.mjs"
import { loadStorage } from "../../utils/loadStorage.mjs"
import LoadingSpinner from "../../components/LoadingSpinner"
import Alert from "../../components/Alert"
import VenueCard from "../../components/VenueCard"

function MyVenues() {
  const [venues, setVenues] = useState([])
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

    async function loadVenues() {
      try {
        const data = await getProfileVenues(profileName, {
          signal: controller.signal,
        })
        setVenues(data)
      } catch (err) {
        if (err.name === "AbortError") return
        setError(err.message)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadVenues()

    return () => controller.abort()
  }, [navigate, profileName])

  if (loading) return <LoadingSpinner />
  if (error) return <Alert type="error" message={error} />

  return (
    <div className="my-venues">
      <div className="my-venues__header">
        <h1 className="my-venues__title">My Venues</h1>
        <Link
          to="/venues/create"
          className="inline-block px-6 py-3 bg-[#0f1a2c] text-white font-semibold rounded-md hover:bg-[#1b44c8] transition-colors"
        >
          Create Venue
        </Link>
      </div>

      {venues.length === 0 ? (
        <p className="my-venues__empty">You have no venues yet.</p>
      ) : (
        <div className="my-venues__grid">
          {venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              to={`/venues/edit/${venue.id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyVenues
