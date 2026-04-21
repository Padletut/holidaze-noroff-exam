import { BASE_URL } from "../config.mjs";
import { fetchData } from "../utils/fetchdata.mjs";

/**
 * Logs in a registered user.
 *
 * Sends a POST request to `/auth/login` and stores the returned access token
 * in localStorage on success.
 *
 * @param {Object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email (must end with @stud.noroff.no).
 * @param {string} credentials.password - The user's password (min 8 characters).
 * @returns {Promise<Object>} The logged-in user's profile data.
 * @throws {Error} Throws an error if the request fails or credentials are invalid.
 *
 * @example
 * const profile = await login({ email: "first.last@stud.noroff.no", password: "UzI1NiIsInR5cCI" })
 */
export async function login({ email, password }) {
  const response = await fetchData(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message ?? "Login failed");
  }

  const { data } = await response.json();

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("profile", JSON.stringify(data));

  return data;
}
