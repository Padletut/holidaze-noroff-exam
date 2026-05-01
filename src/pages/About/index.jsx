import "../../styles/index.scss"
import { Link } from "react-router-dom"

function About() {
  return (
    <div className="about">
      <div className="about__hero">
        <h1 className="about__title">About Holidaze</h1>
        <p className="about__subtitle">
          We connect travellers with unique places to stay around the world.
        </p>
      </div>

      <div className="about__content max-w-4xl mx-auto">
        <section className="about__section">
          <h2 className="about__section-title">Our story</h2>
          <p className="about__text">
            Holidaze was founded with a simple idea: everyone deserves a place
            that feels like home, no matter where in the world they travel.
            We&apos;ve built a platform that makes it easy for hosts to share
            their spaces and for guests to discover somewhere truly special.
          </p>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">What we offer</h2>
          <ul className="about__list">
            <li className="about__list-item">
              <span className="about__list-icon" aria-hidden="true">
                🏡
              </span>
              <div>
                <strong>Unique venues</strong> — from cosy cabins to city
                apartments, handpicked by our community.
              </div>
            </li>
            <li className="about__list-item">
              <span className="about__list-icon" aria-hidden="true">
                📅
              </span>
              <div>
                <strong>Easy booking</strong> — check availability and book
                instantly with real-time calendar updates.
              </div>
            </li>
            <li className="about__list-item">
              <span className="about__list-icon" aria-hidden="true">
                🔑
              </span>
              <div>
                <strong>Host your space</strong> — venue managers can list and
                manage their properties directly on the platform.
              </div>
            </li>
          </ul>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">Get in touch</h2>
          <p className="about__text">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
          <Link to="/contact" className="about__cta">
            Contact us
          </Link>
        </section>
      </div>
    </div>
  )
}

export default About
