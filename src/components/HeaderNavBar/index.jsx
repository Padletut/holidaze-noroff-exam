import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { loadStorage } from "../../utils/loadStorage.mjs"
import { clearSession } from "../../utils/clearSession.mjs"

function HeaderNavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const isLoggedIn = Boolean(loadStorage("accessToken"))

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleSignOut = () => {
    clearSession()
    setIsOpen(false)
    navigate("/")
  }

  return (
    <nav className="w-full px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold tracking-tight logo-nav">
          Holidaze
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }
          >
            Explore
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }
          >
            My Account
          </NavLink>
        </div>
        <div className="signin-nav-button hidden md:block">
          {isLoggedIn ? (
            <button className="nav-link" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <NavLink
              to="/authenticate"
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
            >
              Sign In
            </NavLink>
          )}
        </div>

        {/* Hamburger button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-current"></span>
          <span className="block w-6 h-0.5 bg-current"></span>
          <span className="block w-6 h-0.5 bg-current"></span>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-3 pt-3 px-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }
            onClick={toggleMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }
            onClick={toggleMenu}
          >
            Explore
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }
            onClick={toggleMenu}
          >
            My Account
          </NavLink>
          {isLoggedIn ? (
            <button className="nav-link" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <NavLink
              to="/authenticate"
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
              onClick={toggleMenu}
            >
              Sign In
            </NavLink>
          )}
        </div>
      )}
    </nav>
  )
}

export default HeaderNavBar
