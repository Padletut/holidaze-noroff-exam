import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { loadStorage } from "../../../utils/loadStorage.mjs"
import "../../../../src/styles/index.scss"

function ChevronDown() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

const LINK_MAP = {
  "Sign In": "/authenticate",
  "My Bookings": "/bookings",
  "My Venues": "/venues/my",
  "About Us": "/about",
  Contact: "/contact",
}

function FooterLink({ link }) {
  const to = LINK_MAP[link]
  return to ? (
    <Link to={to} className="footer__link">
      {link}
    </Link>
  ) : (
    <a href="#" className="footer__link">
      {link}
    </a>
  )
}

function Footer() {
  const [open, setOpen] = useState(null)
  useLocation() // re-reads localStorage on every navigation
  const isLoggedIn = Boolean(loadStorage("accessToken"))
  const storedProfile = loadStorage("profile")
  const isVenueManager = Boolean(storedProfile?.venueManager)

  const accountLinks = isLoggedIn
    ? ["My Bookings", ...(isVenueManager ? ["My Venues"] : []), "Sign Out"]
    : ["Sign In"]

  const sections = [
    {
      title: "Account",
      links: accountLinks,
    },
    {
      title: "Company",
      links: ["About Us", "Contact"],
    },
  ]

  const toggle = (i) => setOpen(open === i ? null : i)

  return (
    <footer className="footer flex flex-col items-center justify-between">
      {/* Mobile accordion */}
      <div className="footer__accordion md:hidden">
        {sections.map((section, i) => (
          <div key={section.title} className="footer__accordion-item">
            <button
              className={`footer__accordion-trigger${open === i ? " mb-5" : ""}`}
              onClick={() => toggle(i)}
              aria-expanded={open === i}
            >
              <span className="footer__section-title">{section.title}</span>
              <span
                className={`footer__chevron${open === i ? " footer__chevron--open" : ""}`}
              >
                <ChevronDown />
              </span>
            </button>
            {open === i && (
              <ul className="footer__links">
                {section.links.map((link) => (
                  <li key={link}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Mobile social */}
        <div className="footer__social footer__social--mobile">
          <a href="#" aria-label="Instagram" className="footer__social-link">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="footer__social-link footer__social-link--fb"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <rect x="0" y="0" width="24" height="24" rx="4" />
              <path
                d="M16 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 0 1 4-4h2v3z"
                fill="white"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Desktop grid */}
      <div className="footer__desktop max-w-7xl hidden md:grid">
        {sections.map((section) => (
          <div key={section.title} className="footer__column">
            <span className="footer__section-title">{section.title}</span>
            <ul className="footer__links">
              {section.links.map((link) => (
                <li key={link}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer__column footer__column--right">
          <span className="footer__section-title">Follow Us</span>
          <div className="footer__social">
            <a href="#" aria-label="Instagram" className="footer__social-link">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="footer__social-link footer__social-link--fb"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="0" y="0" width="24" height="24" rx="4" />
                <path
                  d="M16 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 0 1 4-4h2v3z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <span className="footer__copyright">
          © 2026 Holidaze, All rights reserved.
        </span>
        <div className="footer__legal">
          <a href="#" className="footer__legal-link">
            Privacy Policy
          </a>
          <a href="#" className="footer__legal-link">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
