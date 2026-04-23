/**
 * Clears the user session from local storage.
 * @memberof module:Storage
 * @example
 * ```javascript
 * clearSession();
 * ```
 */
export function clearSession() {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("profile")
}
