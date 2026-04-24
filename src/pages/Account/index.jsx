import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../../styles/index.scss"
import { getProfile } from "../../api/profiles/getProfile"
import { getProfileBookings } from "../../api/profiles/getProfileBookings"
import EditProfileModal from "../../components/EditProfileModal"
import LoadingSpinner from "../../components/LoadingSpinner"
import { loadStorage } from "../../utils/loadStorage.mjs"
import { clearSession } from "../../utils/clearSession.mjs"
import Alert from "../../components/Alert"

function Account() {
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(null)
  const navigate = useNavigate()

  const storedProfile = loadStorage("profile")

  useEffect(() => {
    if (!storedProfile) {
      navigate("/authenticate")
      return
    }

    Promise.all([
      getProfile(storedProfile.name),
      getProfileBookings(storedProfile.name),
    ])
      .then(([profileData, bookingsData]) => {
        setProfile(profileData)
        setBookings(bookingsData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    clearSession()
    navigate("/")
  }

  const handleSave = (updated) => {
    setProfile((prev) => ({ ...prev, ...updated }))
    setShowModal(false)
    setSaveSuccess("Profile updated successfully!")
    setTimeout(() => setSaveSuccess(null), 4000)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <Alert type="error" message={error} />
  if (!profile) return null

  return (
    <div className="account-page">
      {/* Profile header */}
      <div
        className="account-header"
        style={
          profile.banner?.url
            ? { backgroundImage: `url(${profile.banner.url})` }
            : undefined
        }
      >
        {/* Dark overlay when banner is present */}
        {profile.banner?.url && (
          <div className="account-header__overlay" aria-hidden="true" />
        )}
        <div
          className="account-header__blob account-header__blob--1"
          aria-hidden="true"
        />
        <div
          className="account-header__blob account-header__blob--2"
          aria-hidden="true"
        />

        <div className="account-header__inner">
          <img
            src={profile.avatar?.url || "/placeholder.jpg"}
            alt={profile.avatar?.alt || profile.name}
            className="account-header__avatar"
          />
          <div className="account-header__card">
            <p className="account-header__card-label">{profile.name}</p>
            <p className="account-header__card-email">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="account-body">
        <Alert type="success" message={saveSuccess} />
        <h1 className="account-body__title">Account</h1>
        <p className="account-body__subtitle">
          Manage your profile, bookings, and venues
        </p>

        {profile.bio && <p className="account-body__bio">{profile.bio}</p>}

        {/* Bookings */}
        <div className="account-section__wrapper max-w-7xl">
          <section className="account-section">
            <h2 className="account-section__heading">Bookings</h2>
            <div className="account-section__card account-section__card--bookings">
              {(() => {
                const today = new Date().toISOString().slice(0, 10)
                const upcoming = bookings
                  .filter((b) => b.dateFrom.slice(0, 10) >= today)
                  .sort((a, b) => a.dateFrom.localeCompare(b.dateFrom))
                const preview = upcoming[0]
                if (!preview) {
                  return (
                    <p className="account-section__empty">
                      No upcoming bookings.
                    </p>
                  )
                }
                const venue = preview.venue
                const image = venue?.media?.[0]
                const from = new Date(preview.dateFrom)
                const to = new Date(preview.dateTo)
                const opts = { day: "numeric", month: "short" }
                const dateRange = `${from.toLocaleDateString("en-GB", opts)} – ${to.toLocaleDateString("en-GB", opts)}`
                return (
                  <Link
                    to={`/venue/${venue?.id}`}
                    className="account-booking-preview"
                  >
                    <img
                      src={image?.url || "/placeholder.jpg"}
                      alt={image?.alt || venue?.name || "Venue"}
                      className="account-booking-preview__image"
                    />
                    <div className="account-booking-preview__body">
                      <p className="account-booking-preview__name">
                        {venue?.name || "Unknown venue"}
                      </p>
                      <p className="account-booking-preview__dates">
                        {dateRange}
                      </p>
                    </div>
                  </Link>
                )
              })()}
              {bookings.length > 0 && (
                <Link to="/bookings" className="account-section__link">
                  View all bookings <span aria-hidden="true">&gt;</span>
                </Link>
              )}
            </div>
          </section>

          {/* Venue Management */}
          {profile.venueManager && (
            <section className="account-section">
              <h2 className="account-section__heading">Venue Management</h2>
              <div className="account-section__card account-section__card--list">
                <Link to="/venues/my" className="account-section__list-item">
                  <span
                    className="account-section__list-icon"
                    aria-hidden="true"
                  >
                    🏠
                  </span>
                  My Venues
                  <span
                    className="account-section__list-arrow"
                    aria-hidden="true"
                  >
                    &gt;
                  </span>
                </Link>
                <Link
                  to="/venues/create"
                  className="account-section__list-item"
                >
                  <span
                    className="account-section__list-icon"
                    aria-hidden="true"
                  >
                    ＋
                  </span>
                  Create Venue
                  <span
                    className="account-section__list-arrow"
                    aria-hidden="true"
                  >
                    &gt;
                  </span>
                </Link>
                <Link
                  to="/venues/bookings"
                  className="account-section__list-item"
                >
                  <span
                    className="account-section__list-icon"
                    aria-hidden="true"
                  >
                    📅
                  </span>
                  Venue Bookings
                  <span
                    className="account-section__list-arrow"
                    aria-hidden="true"
                  >
                    &gt;
                  </span>
                </Link>
              </div>
            </section>
          )}

          {/* Account settings */}
          <section className="account-section">
            <h2 className="account-section__heading">Account</h2>
            <div className="account-section__card account-section__card--list">
              <button
                className="account-section__list-item account-section__list-item--btn"
                onClick={() => setShowModal(true)}
              >
                <span className="account-section__list-icon" aria-hidden="true">
                  👤
                </span>
                Update Profile
                <span
                  className="account-section__list-arrow"
                  aria-hidden="true"
                >
                  &gt;
                </span>
              </button>
              <button
                className="account-section__list-item account-section__list-item--btn"
                onClick={handleLogout}
              >
                <span className="account-section__list-icon" aria-hidden="true">
                  ⏻
                </span>
                Log Out
                <span
                  className="account-section__list-arrow"
                  aria-hidden="true"
                >
                  &gt;
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {showModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default Account
