import "../../styles/index.scss"
import Hero from "./Hero"
import SearchBar from "../../components/SearchBar"
import VenueCard from "../../components/VenueCard"
import LoadingSpinner from "../../components/LoadingSpinner"
import { getVenues } from "../../api/venues/getVenues"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Alert from "../../components/Alert"

function Home() {
  const [venues, setVenues] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getVenues()
      .then((result) => setVenues(result.data.slice(0, 6)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSearchSubmit = ({ query, guests, checkIn, checkOut }) => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (guests) params.set("guests", guests)
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)
    navigate(`/explore?${params.toString()}`)
  }

  return (
    <div className="home relative">
      <Hero />
      <div className="-mt-16 px-4 relative z-10">
        <SearchBar onSubmit={handleSearchSubmit} />
      </div>
      <div className="home-content max-w-6xl mx-auto py-8">
        <h2 className="home-content__heading text-center mb-8">
          Popular Destinations
        </h2>
        <p className="home-content__text text-center mb-12">
          Browse through our selection of the most popular places to stay.
        </p>
        <Alert type="error" message={error} />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="home-content__venues grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
