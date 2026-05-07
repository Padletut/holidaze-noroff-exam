// @ts-check
import { test, expect } from "@playwright/test"

// Use a pre-existing stud.noroff.no test account for login tests.
// The "successful login" test requires a real registered account.
const KNOWN_EMAIL = process.env.TEST_EMAIL ?? ""
const KNOWN_PASSWORD = process.env.TEST_PASSWORD ?? ""

test.describe("Login form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/authenticate")
    // Login form is shown by default
  })

  // ── Rendering ────────────────────────────────────────────────────────────────

  test("shows the login form on the /authenticate page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
    await expect(page.locator("#login-email")).toBeVisible()
    await expect(page.locator("#login-password")).toBeVisible()
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible()
  })

  // ── Validation errors ─────────────────────────────────────────────────────────

  test("shows validation errors when submitting an empty form", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page.getByText("Please enter your email")).toBeVisible()
    await expect(page.getByText("Please enter your password")).toBeVisible()
  })

  test("shows an error for a non stud.noroff.no email", async ({ page }) => {
    await page.locator("#login-email").fill("user@gmail.com")
    await page.locator("#login-email").blur()

    await expect(
      page.getByText("Email must end with @stud.noroff.no"),
    ).toBeVisible()
  })

  test("shows an error for a completely invalid email", async ({ page }) => {
    await page.locator("#login-email").fill("notanemail")
    await page.locator("#login-email").blur()

    await expect(
      page.getByText("Please enter a valid email address"),
    ).toBeVisible()
  })

  test("shows an error when the password is too short", async ({ page }) => {
    await page.locator("#login-password").fill("short")
    await page.locator("#login-password").blur()

    await expect(
      page.getByText("Please enter a password with at least 8 characters"),
    ).toBeVisible()
  })

  // ── Valid inline feedback ─────────────────────────────────────────────────────

  test("clears the email error once a valid stud.noroff.no email is entered", async ({
    page,
  }) => {
    await page.locator("#login-email").fill("bad@gmail.com")
    await page.locator("#login-email").blur()
    await expect(
      page.getByText("Email must end with @stud.noroff.no"),
    ).toBeVisible()

    await page.locator("#login-email").fill("user@stud.noroff.no")
    await page.locator("#login-email").blur()
    await expect(
      page.getByText("Email must end with @stud.noroff.no"),
    ).not.toBeVisible()
  })

  // ── Switch view ───────────────────────────────────────────────────────────────

  test("can switch to the Register view", async ({ page }) => {
    await page.getByRole("button", { name: "Sign Up" }).click()

    await expect(
      page.getByRole("heading", { name: "Create account" }),
    ).toBeVisible()
  })

  // ── Wrong credentials ─────────────────────────────────────────────────────────

  test("shows an API error for invalid credentials", async ({ page }) => {
    await page.locator("#login-email").fill("nobody@stud.noroff.no")
    await page.locator("#login-password").fill("WrongPass99")
    await page.getByRole("button", { name: "Login" }).click()

    // The API returns an error; the form should display it
    await expect(page.locator(".alert--error, [role='alert']")).toBeVisible({
      timeout: 10000,
    })
  })

  // ── Successful login ──────────────────────────────────────────────────────────

  test("redirects to /account after a successful login", async ({ page }) => {
    test.skip(
      !KNOWN_EMAIL || !KNOWN_PASSWORD,
      "Set TEST_EMAIL and TEST_PASSWORD env vars to run this test",
    )

    await page.locator("#login-email").fill(KNOWN_EMAIL)
    await page.locator("#login-password").fill(KNOWN_PASSWORD)
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page.getByText(/logged in/i)).toBeVisible({ timeout: 10000 })
    await page.waitForURL("/account", { timeout: 10000 })
    await expect(page).toHaveURL(/\/account$/)
  })
})
