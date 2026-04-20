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
    </div>
  )
}

export default Home
