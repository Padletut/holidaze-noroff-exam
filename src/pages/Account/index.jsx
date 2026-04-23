import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../../styles/index.scss"
import { getProfile } from "../../api/profiles/getProfile"
import EditProfileModal from "../../components/EditProfileModal"
import LoadingSpinner from "../../components/LoadingSpinner"
import { loadStorage } from "../../utils/loadStorage.mjs"
import { clearSession } from "../../utils/clearSession.mjs"
import Alert from "../../components/Alert"

function Account() {
  const [profile, setProfile] = useState(null)
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

    getProfile(storedProfile.name)
      .then((data) => setProfile(data))
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
        <section className="account-section">
          <h2 className="account-section__heading">Bookings</h2>
          <div className="account-section__card">
            <p className="account-section__empty">No upcoming bookings.</p>
            <Link to="/mybookings" className="account-section__link">
              View all bookings <span aria-hidden="true">&gt;</span>
            </Link>
          </div>
        </section>

        {/* Venue Management */}
        {profile.venueManager && (
          <section className="account-section">
            <h2 className="account-section__heading">Venue Management</h2>
            <div className="account-section__card account-section__card--list">
              <Link to="/venues/my" className="account-section__list-item">
                <span className="account-section__list-icon" aria-hidden="true">
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
              <Link to="/venues/create" className="account-section__list-item">
                <span className="account-section__list-icon" aria-hidden="true">
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
                <span className="account-section__list-icon" aria-hidden="true">
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
              <span className="account-section__list-arrow" aria-hidden="true">
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
              <span className="account-section__list-arrow" aria-hidden="true">
                &gt;
              </span>
            </button>
          </div>
        </section>
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
