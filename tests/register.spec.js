// @ts-check
import { test, expect } from "@playwright/test"

// Unique suffix per run — kept short so name stays within the 20-char API limit
const suffix = String(Date.now()).slice(-6)
const VALID_NAME = `tuser_${suffix}`
const VALID_EMAIL = `tuser_${suffix}@stud.noroff.no`
const VALID_PASSWORD = "TestPass123"

test.describe("Register form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/authenticate")
    // Switch from Login to Register view
    await page.getByRole("button", { name: "Sign Up" }).click()
  })

  // ── Rendering ────────────────────────────────────────────────────────────────

  test("shows the registration form after clicking Sign Up", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Create account" }),
    ).toBeVisible()
    await expect(page.locator("#register-name")).toBeVisible()
    await expect(page.locator("#register-email")).toBeVisible()
    await expect(page.locator("#register-password")).toBeVisible()
    await expect(page.locator("#register-confirm-password")).toBeVisible()
    await expect(page.locator("#register-venue-manager")).toBeVisible()
  })

  // ── Validation errors ─────────────────────────────────────────────────────────

  test("shows validation errors when submitting an empty form", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Sign Up" }).last().click()

    await expect(page.getByText("Please enter your name")).toBeVisible()
    await expect(page.getByText("Please enter your email")).toBeVisible()
    await expect(page.getByText("Please enter a password")).toBeVisible()
    await expect(page.getByText("Please confirm your password")).toBeVisible()
  })

  test("shows an error when the name is too short", async ({ page }) => {
    await page.locator("#register-name").fill("ab")
    await page.locator("#register-name").blur()

    await expect(
      page.getByText("Name must be at least 3 characters"),
    ).toBeVisible()
  })

  test("shows an error for a non stud.noroff.no email", async ({ page }) => {
    await page.locator("#register-email").fill("user@gmail.com")
    await page.locator("#register-email").blur()

    await expect(
      page.getByText("Email must end with @stud.noroff.no"),
    ).toBeVisible()
  })

  test("shows an error when the password is too short", async ({ page }) => {
    await page.locator("#register-password").fill("short")
    await page.locator("#register-password").blur()

    await expect(
      page.getByText("Please enter a password with at least 8 characters"),
    ).toBeVisible()
  })

  test("shows an error when the passwords do not match", async ({ page }) => {
    await page.locator("#register-password").fill(VALID_PASSWORD)
    await page.locator("#register-confirm-password").fill("Different99")
    await page.locator("#register-confirm-password").blur()

    await expect(page.getByText("Passwords do not match")).toBeVisible()
  })

  // ── Valid state ───────────────────────────────────────────────────────────────

  test("clears password-mismatch error once passwords match", async ({
    page,
  }) => {
    await page.locator("#register-password").fill(VALID_PASSWORD)
    await page.locator("#register-confirm-password").fill("Different99")
    await page.locator("#register-confirm-password").blur()
    await expect(page.getByText("Passwords do not match")).toBeVisible()

    await page.locator("#register-confirm-password").fill(VALID_PASSWORD)
    await page.locator("#register-confirm-password").blur()
    await expect(page.getByText("Passwords do not match")).not.toBeVisible()
  })

  test("can toggle the Venue Manager checkbox", async ({ page }) => {
    const checkbox = page.locator("#register-venue-manager")
    await expect(checkbox).not.toBeChecked()
    await checkbox.check()
    await expect(checkbox).toBeChecked()
    await checkbox.uncheck()
    await expect(checkbox).not.toBeChecked()
  })

  // ── Switch view ───────────────────────────────────────────────────────────────

  test("can switch back to the Login view", async ({ page }) => {
    await page.getByRole("button", { name: "Sign In" }).click()

    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
  })

  // ── Successful registration ───────────────────────────────────────────────────

  test("redirects to /account after a successful registration", async ({
    page,
  }) => {
    await page.locator("#register-name").fill(VALID_NAME)
    await page.locator("#register-email").fill(VALID_EMAIL)
    await page.locator("#register-password").fill(VALID_PASSWORD)
    await page.locator("#register-confirm-password").fill(VALID_PASSWORD)

    await page.getByRole("button", { name: "Sign Up" }).last().click()

    // Success message should appear
    await expect(page.getByText(/Account created/i)).toBeVisible({
      timeout: 10000,
    })

    // Then the app navigates to /account
    await page.waitForURL("/account", { timeout: 10000 })
    await expect(page).toHaveURL(/\/account$/)
  })
})
