import { matchPath } from "react-router-dom"

export default function getDocumentTitle(pathname, routes) {
  const matchedRoute = routes.find(({ index, path }) => {
    if (index) {
      return pathname === "/"
    }

    return Boolean(matchPath({ path, end: true }, pathname))
  })

  if (!matchedRoute) {
    return "Holidaze | Not Found"
  }

  return `Holidaze | ${matchedRoute.title}`
}