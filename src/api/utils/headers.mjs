
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Builds a Headers object for API requests.
 *
 * Automatically attaches the Bearer token from localStorage if the user is
 * logged in, and the Noroff API key from environment variables.
 *
 * @param {boolean} [hasBody=false] - Set to true for requests with a JSON body (POST/PUT/PATCH).
 *   Adds `Content-Type: application/json` when true.
 * @returns {Headers} A Headers object ready to be passed to fetch.
 *
 * @example
 * // GET request (no body)
 * const res = await fetch(url, { headers: headers() })
 *
 * @example
 * // POST request (with body)
 * const res = await fetch(url, { method: "POST", body: JSON.stringify(data), headers: headers(true) })
 */
export function headers(hasBody = false) {
  const headers = new Headers();
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
  }

  if (hasBody) {
    headers.append("Content-Type", "application/json");
  }

  return headers;
}