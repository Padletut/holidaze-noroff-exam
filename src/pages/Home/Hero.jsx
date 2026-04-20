import "../../styles/index.scss"
import heroImage from "../../assets/ChatGPT Image 16. feb. 2026, 23_01_19.png"

function Hero() {
  return (
    <div className="hero">
      <img src={heroImage} alt="Hero Image" className="hero-image" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>
          Find Your <span>Perfect Getaway</span>
        </h1>
        <p>Discover and book unique stays at beautiful destinations.</p>
      </div>
    </div>
  )
}

export default Hero
