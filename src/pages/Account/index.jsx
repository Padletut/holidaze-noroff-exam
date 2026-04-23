import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../../styles/index.scss"
import { getProfile } from "../../api/profiles/getProfile"
import EditProfileModal from "../../components/EditProfileModal"
import LoadingSpinner from "../../components/LoadingSpinner"

function Account() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const storedProfile = JSON.parse(localStorage.getItem("profile") || "null")

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
    localStorage.removeItem("accessToken")
    localStorage.removeItem("profile")
    navigate("/")
  }

  const handleSave = (updated) => {
    setProfile((prev) => ({ ...prev, ...updated }))
    setShowModal(false)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <p className="account-page__error">{error}</p>
  if (!profile) return null

  return (
    <div className="account-page">
      {/* Profile header */}
      <div className="account-header">
        {profile.banner?.url && (
          <div className="account-header__banner">
            <img
              src={profile.banner.url}
              alt={profile.banner.alt || "Profile banner"}
              className="account-header__banner-img"
            />
          </div>
        )}
        <div className="account-header__info">
          <img
            src={profile.avatar?.url || "/placeholder.jpg"}
            alt={profile.avatar?.alt || profile.name}
            className="account-header__avatar"
          />
          <div className="account-header__text">
            <p className="account-header__name">{profile.name}</p>
            <p className="account-header__email">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="account-body">
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
            <Link to="/bookings" className="account-section__link">
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
