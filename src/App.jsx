import Layout from "./components/layout"
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import VenueDetail from "./pages/VenueDetail"
import Authenticate from "./pages/Authenticate"
import Account from "./pages/Account"
import MyBookings from "./pages/MyBookings"
import BookingConfirmation from "./pages/BookingConfirmation"
import RouteNotFound from "./pages/RouteNotFound"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/venue/:id" element={<VenueDetail />} />
        <Route path="/account" element={<Account />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/booking-confirmed" element={<BookingConfirmation />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="*" element={<RouteNotFound />} />
      </Route>
    </Routes>
  )
}

export default App
