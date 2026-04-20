import "../../styles/index.scss"
import Hero from "./Hero"
import SearchBar from "../../components/SearchBar"

function Home() {
  return (
    <div className="home relative">
      <Hero />
      <div className="-mt-16 px-4 relative z-10">
        <SearchBar />
      </div>
      <div className="home-content max-w-6xl mx-auto py-8">
        <h2 className="home-content__heading text-center mb-8">
          Popular Destinations
        </h2>
        <p className="home-content__text text-center mb-12">
          Browse through our selection of the most popular places to stay.
        </p>
      </div>
    </div>
  )
}

export default Home
