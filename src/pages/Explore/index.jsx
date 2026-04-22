import "../../styles/index.scss"
import SearchBar from "../../components/SearchBar"
import VenueCard from "../../components/VenueCard"
import LoadingSpinner from "../../components/LoadingSpinner"
import { getVenues } from "../../api/venues/getVenues"
import { searchVenues } from "../../api/venues/searchVenues"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { groupByCountry } from "../../utils/groupByCountry.mjs"

function Explore() {
  const [urlParams] = useSearchParams()

  const initialQuery = urlParams.get("q") ?? ""
  const initialGuests = urlParams.get("guests") ?? ""
  const initialCheckIn = urlParams.get("checkIn") ?? ""
  const initialCheckOut = urlParams.get("checkOut") ?? ""

  // Browse state (paginated, infinite scroll)
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [browseError, setBrowseError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(1)
  const sentinelRef = useRef(null)

  // Search state
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(
    initialQuery.trim().length > 0,
  )
  const [searchError, setSearchError] = useState(null)
  const [searchParams, setSearchParams] = useState({
    query: initialQuery,
    guests: initialGuests,
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
  })
  const debounceRef = useRef(null)

  const isSearching = searchParams.query.trim().length > 0

  // Active list before guest filter
  const activeVenues = isSearching ? searchResults : venues

  // Guest filter applied client-side
  const filteredVenues = searchParams.guests
    ? activeVenues.filter((v) => v.maxGuests >= Number(searchParams.guests))
    : activeVenues

  // Initial browse fetch
  useEffect(() => {
    getVenues(1)
      .then((data) => {
        const items = data.data ?? data
        const meta = data.meta
        setVenues(items)
        setHasMore(meta ? meta.currentPage < meta.pageCount : items.length > 0)
      })
      .catch((err) => setBrowseError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // If arriving from Home with a pre-filled query, run search immediately
  useEffect(() => {
    if (!initialQuery.trim()) return
    searchVenues(initialQuery)
      .then((data) => setSearchResults(data.data ?? data))
      .catch((err) => setSearchError(err.message))
      .finally(() => setSearchLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll — only active in browse mode
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || isSearching) return
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
            .catch((err) => setBrowseError(err.message))
            .finally(() => setLoadingMore(false))
        }
      },
      { rootMargin: "200px" },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, loading, isSearching])

  // Called by SearchBar on every field change — debounces the API call
  const handleSearch = ({ query, guests, checkIn, checkOut }) => {
    setSearchParams({ query, guests, checkIn, checkOut })
    clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setSearchResults([])
      setSearchError(null)
      return
    }

    debounceRef.current = setTimeout(() => {
      setSearchLoading(true)
      setSearchError(null)
      searchVenues(query)
        .then((data) => setSearchResults(data.data ?? data))
        .catch((err) => setSearchError(err.message))
        .finally(() => setSearchLoading(false))
    }, 400)
  }

  const grouped = Object.entries(groupByCountry(filteredVenues))
  const error = isSearching ? searchError : browseError
  const showLoading = isSearching ? searchLoading : loading

  return (
    <main className="explore">
      <div className="explore__header">
        <h1 className="explore__title">Explore</h1>
        <p className="explore__subtitle">Explore unique places to stay.</p>
      </div>

      <div className="explore__search">
        <SearchBar
          onSearch={handleSearch}
          initialValues={{
            query: initialQuery,
            guests: initialGuests,
            checkIn: initialCheckIn,
            checkOut: initialCheckOut,
          }}
        />
      </div>

      {showLoading && <LoadingSpinner />}

      {error && <p className="explore__error">{error}</p>}

      {!showLoading && !error && (
        <>
          {grouped.map(([country, countryVenues]) => (
            <section key={country} className="explore__group">
              <h2 className="explore__group-title">{country}</h2>
              <div className="explore__venues-list">
                {countryVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            </section>
          ))}
          {!isSearching && (
            <>
              <div ref={sentinelRef} />
              {loadingMore && <LoadingSpinner />}
            </>
          )}
        </>
      )}
    </main>
  )
}

export default Explore
