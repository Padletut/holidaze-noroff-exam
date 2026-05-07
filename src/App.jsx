import { createElement, useEffect } from "react"
import Layout from "./components/layout"
import Home from "./pages/Home"
import Explore from "./pages/Explore"
import VenueDetail from "./pages/VenueDetail"
import Authenticate from "./pages/Authenticate"
import Account from "./pages/Account"
import MyBookings from "./pages/MyBookings"
import MyVenues from "./pages/MyVenues"
import VenueForm from "./pages/VenueForm"
import VenueBookings from "./pages/VenueBookings"
import BookingConfirmation from "./pages/BookingConfirmation"
import About from "./pages/About"
import Contact from "./pages/Contact"
import RouteNotFound from "./pages/RouteNotFound"
import { Route, Routes, useLocation } from "react-router-dom"
import getDocumentTitle from "./utils/getDocumentTitle.mjs"

const appRoutes = [
  { key: "home", index: true, title: "Home", component: Home },
  { path: "/explore", title: "Explore", component: Explore },
  { path: "/venue/:id", title: "Venue Details", component: VenueDetail },
  { path: "/account", title: "Account", component: Account },
  { path: "/bookings", title: "My Bookings", component: MyBookings },
  { path: "/venues/my", title: "My Venues", component: MyVenues },
  { path: "/venues/create", title: "Create Venue", component: VenueForm },
  { path: "/venues/edit/:id", title: "Edit Venue", component: VenueForm },
  {
    path: "/venues/bookings",
    title: "Venue Bookings",
    component: VenueBookings,
  },
  {
    path: "/booking-confirmed",
    title: "Booking Confirmed",
    component: BookingConfirmation,
  },
  { path: "/about", title: "About", component: About },
  { path: "/contact", title: "Contact", component: Contact },
  { path: "/authenticate", title: "Authenticate", component: Authenticate },
]

function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = getDocumentTitle(pathname, appRoutes)
  }, [pathname])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {appRoutes.map(({ key, index, path, component }) => {
          if (index) {
            return <Route key={key} index element={createElement(component)} />
          }

          return (
            <Route key={path} path={path} element={createElement(component)} />
          )
        })}
        <Route path="*" element={<RouteNotFound />} />
      </Route>
    </Routes>
  )
}

export default App
