import { Link } from "react-router-dom"

function RouteNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-8xl font-bold text-black mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-black mb-3">
        Oops! We couldn&apos;t find that page
      </h2>
      <p className="text-black mb-8 max-w-md">
        The page you&apos;re looking for may have been moved, renamed, or
        doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <nav aria-label="Error page navigation">
        <Link
          to="/"
          className="inline-block px-6 py-3 my-12 bg-[#0f1a2c] text-white font-semibold rounded-md hover:bg-[#1b44c8] transition-colors"
        >
          Go to Homepage
        </Link>
      </nav>
    </div>
  )
}

export default RouteNotFound
