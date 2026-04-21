import { BASE_URL } from "../config.mjs";
import { fetchData } from "../utils/fetchdata.mjs";

/**
 * Registers a new user profile.
 *
 * Sends a POST request to `/auth/register`. On success a 201 is returned with
 * the newly created profile. The user must then log in separately to obtain an
 * access token.
 *
 * @param {Object} profile - The new user's registration data.
 * @param {string} profile.name - Required. Username (no punctuation except underscore).
 * @param {string} profile.email - Required. Must end with @stud.noroff.no.
 * @param {string} profile.password - Required. Minimum 8 characters.
 * @param {boolean} [profile.venueManager=false] - Optional. Set true to register as a venue manager.
 * @returns {Promise<Object>} The newly created user profile.
 * @throws {Error} Throws an error if registration fails.
 *
 * @example
 * const profile = await register({
 *   name: "my_username",
 *   email: "first.last@stud.noroff.no",
 *   password: "UzI1NiIsInR5cCI",
 *   venueManager: false,
 * })
 */
export async function register({ name, email, password, venueManager = false }) {
  const body = { name, email, password, venueManager };


  const response = await fetchData(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message ?? "Registration failed");
  }

  const { data } = await response.json();

  return data;
}
