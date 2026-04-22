import Layout from "./components/layout"
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import Authenticate from "./pages/Authenticate"
import RouteNotFound from "./pages/RouteNotFound"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/account" element={<h1>My Account</h1>} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="*" element={<RouteNotFound />} />
      </Route>
    </Routes>
  )
}

export default App
