import "../../styles/index.scss"
import heroImage from "../../assets/ChatGPT Image 16. feb. 2026, 23_01_19.png"

function Hero() {
  return (
    <div className="hero">
      <img src={heroImage} alt="Hero Image" className="hero__image" />
      <div className="hero__overlay" />
      <div className="hero__content px-4 py-3">
        <div className="hero__content-inner max-w-7xl mx-auto w-full">
          <h1>
            Find Your <span>Perfect Getaway</span>
          </h1>
          <p>Discover and book unique stays at beautiful destinations.</p>
        </div>
      </div>
    </div>
  )
}

export default Hero
