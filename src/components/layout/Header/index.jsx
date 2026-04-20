import HeaderNavBar from "../../HeaderNavBar"

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0f1a2c]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#0f1a2c]/60">
      <HeaderNavBar />
    </header>
  )
}

export default Header
