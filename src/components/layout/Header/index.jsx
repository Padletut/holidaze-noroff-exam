import HeaderNavBar from "../../HeaderNavBar"

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[#f6f1e8]/95 backdrop-blur supports-[backdrop-filter]:bg-[#f6f1e8]/60">
      <HeaderNavBar />
    </header>
  )
}

export default Header
