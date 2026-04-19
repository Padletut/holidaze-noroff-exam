import { useState } from "react"
import { Link, NavLink } from "react-router-dom"

function HeaderNavBar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Holidaze
        </Link>
        <div className={`navbar-menu ${isOpen ? "open" : ""}`}>
          <NavLink to="/" className="navbar-link" onClick={toggleMenu}>
            Home
          </NavLink>
          <NavLink to="/about" className="navbar-link" onClick={toggleMenu}>
            About
          </NavLink>
        </div>
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  )
}

export default HeaderNavBar
