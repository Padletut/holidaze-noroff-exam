import HeaderNavBar from "../../HeaderNavBar"

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f1a2c]/10 backdrop-blur-md supports-[backdrop-filter]:bg-[#0f1a2c]/90">
      <HeaderNavBar />
    </header>
  )
}

export default Header
