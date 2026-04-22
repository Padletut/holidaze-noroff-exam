import "../../styles/index.scss"
import SearchBar from "../../components/SearchBar"
import VenueCard from "../../components/VenueCard"
import LoadingSpinner from "../../components/LoadingSpinner"
import { getVenues } from "../../api/venues/getVenues"
import { useEffect, useRef, useState } from "react"

function Explore() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(1)
  const sentinelRef = useRef(null)

  // Initial fetch — loading starts as true, no synchronous setState in effect body
  useEffect(() => {
    getVenues(1)
      .then((data) => {
        const items = data.data ?? data
        const meta = data.meta
        setVenues(items)
        setHasMore(meta ? meta.currentPage < meta.pageCount : items.length > 0)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Infinite scroll — setState called only inside IntersectionObserver callback
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          const nextPage = pageRef.current + 1
          pageRef.current = nextPage
          setLoadingMore(true)
          getVenues(nextPage)
            .then((data) => {
              const items = data.data ?? data
              const meta = data.meta
              setVenues((prev) => [...prev, ...items])
              setHasMore(
                meta ? meta.currentPage < meta.pageCount : items.length > 0,
              )
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoadingMore(false))
        }
      },
      { rootMargin: "200px" },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, loading])

  return (
    <main className="explore">
      <div className="explore__header">
        <h1 className="explore__title">Explore</h1>
        <p className="explore__subtitle">Explore unique places to stay.</p>
      </div>

      <div className="explore__search">
        <SearchBar />
      </div>

      {loading && <LoadingSpinner />}

      {error && <p className="explore__error">{error}</p>}

      {!loading && !error && (
        <>
          {Object.entries(
            venues.reduce((groups, venue) => {
              const country = venue.location?.country?.trim() || "Other"
              if (!groups[country]) groups[country] = []
              groups[country].push(venue)
              return groups
            }, {}),
          ).map(([country, countryVenues]) => (
            <section key={country} className="explore__group">
              <h2 className="explore__group-title">{country}</h2>
              <div className="explore__venues-list">
                {countryVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            </section>
          ))}
          <div ref={sentinelRef} />
          {loadingMore && <LoadingSpinner />}
        </>
      )}
    </main>
  )
}

export default Explore
