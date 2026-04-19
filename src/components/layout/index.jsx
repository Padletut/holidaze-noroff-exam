import Header from "./Header"
import Outlet from "./Outlet"
import Footer from "./Footer"

function Layout() {
  return (
    <div className="layout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout
