// @ts-check
import { test, expect } from "@playwright/test"
/** @typedef {import('@playwright/test').Page} Page */

const EMAIL = process.env.TEST_EMAIL ?? ""
const PASSWORD = process.env.TEST_PASSWORD ?? ""

// Optionally pin a specific venue ID. If not set, the test picks the first
// venue card visible on the home page.
const VENUE_ID = process.env.TEST_VENUE_ID ?? ""

// ── helpers ───────────────────────────────────────────────────────────────────

// Cached once by beforeAll so we don't hit the auth API on every test.
/** @type {string} */ let _authToken = ""
/** @type {Record<string,unknown>|null} */ let _authProfile = null

/**
 * Inject cached credentials into localStorage so the React app treats
 * the page as logged-in without going through the login UI.
 * @param {Page} page
 */
async function injectAuth(page) {
  // Navigate to the app origin first so localStorage belongs to the right domain.
  await page.goto("/")
  await page.evaluate(
    ({ token, profile }) => {
      localStorage.setItem("accessToken", JSON.stringify(token))
      localStorage.setItem("profile", JSON.stringify(profile))
    },
    { token: _authToken, profile: _authProfile },
  )
}

/**
 * Delete all bookings for the test user directly via the API
 * (no page / localStorage needed).
 * @param {import('@playwright/test').APIRequestContext} request
 */
async function cleanupBookings(request) {
  if (!_authToken || !_authProfile?.name) return
  const base = process.env.VITE_API_URL ?? ""
  const apiKey = process.env.VITE_API_KEY ?? ""
  const headers = {
    Authorization: `Bearer ${_authToken}`,
    "X-Noroff-API-Key": apiKey,
  }
  const res = await request.get(
    `${base}/holidaze/profiles/${encodeURIComponent(String(_authProfile.name))}/bookings`,
    { headers },
  )
  if (!res.ok()) return
  const { data: bookings } = await res.json()
  for (const booking of bookings ?? []) {
    await request.delete(`${base}/holidaze/bookings/${booking.id}`, { headers })
  }
}

/** Navigate to a venue detail page.
 * @param {Page} page
 */
async function gotoVenue(page) {
  if (VENUE_ID) {
    await page.goto(`/venue/${VENUE_ID}`)
  } else {
    await page.goto("/")
    await page.locator(".venue-card").first().click()
  }
  // Wait for the booking calendar to be fully rendered
  await expect(page.locator(".bc")).toBeVisible({ timeout: 10000 })
}

/** Select check-in / check-out by clicking the first two available days.
 * @param {Page} page
 */
async function selectDates(page) {
  const available = page.locator(".bc__day--available")
  await available.first().click() // check-in
  await available.nth(2).click() // check-out (skip 1 day to guarantee ≥1 night)
  await expect(page.locator(".bc__summary")).toBeVisible()
}

// ── tests ─────────────────────────────────────────────────────────────────────

test.describe("Venue booking (logged-in user)", () => {
  test.describe.configure({ mode: "serial" })
  test.skip(!EMAIL || !PASSWORD, "Set TEST_EMAIL and TEST_PASSWORD in .env")

  // Log in once via the API and clean up any leftover bookings.
  test.beforeAll(async ({ request }) => {
    const base = process.env.VITE_API_URL ?? ""
    const apiKey = process.env.VITE_API_KEY ?? ""
    const res = await request.post(`${base}/auth/login`, {
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": apiKey,
      },
      data: { email: EMAIL, password: PASSWORD },
    })
    const { data } = await res.json()
    _authToken = data.accessToken
    _authProfile = data
    await cleanupBookings(request)
  })

  // Inject credentials into localStorage – fast, no UI round-trip.
  test.beforeEach(async ({ page }) => {
    await injectAuth(page)
  })

  test.afterEach(async ({ request }) => {
    await cleanupBookings(request)
  })

  // ── "Book now" button is visible ─────────────────────────────────────────────

  test("shows the 'Book now' button when the user is logged in", async ({
    page,
  }) => {
    await gotoVenue(page)
    await selectDates(page)

    await expect(page.getByRole("button", { name: "Book now" })).toBeVisible()
  })

  // ── Full booking flow ─────────────────────────────────────────────────────────

  test("redirects to /booking-confirmed after a successful booking", async ({
    page,
  }) => {
    await gotoVenue(page)
    await selectDates(page)

    await page.getByRole("button", { name: "Book now" }).click()

    await page.waitForURL("/booking-confirmed", { timeout: 15000 })
    await expect(
      page.getByRole("heading", { name: /thank you for your booking/i }),
    ).toBeVisible()
  })

  test("confirmation page shows the venue name", async ({ page }) => {
    await gotoVenue(page)

    const venueName =
      (await page.locator(".venue-detail__name").textContent()) ?? ""

    await selectDates(page)
    await page.getByRole("button", { name: "Book now" }).click()
    await page.waitForURL("/booking-confirmed", { timeout: 15000 })

    await expect(
      page.getByText(new RegExp(venueName.trim(), "i")),
    ).toBeVisible()
  })

  test("confirmation page shows check-in and check-out dates", async ({
    page,
  }) => {
    await gotoVenue(page)
    await selectDates(page)

    await page.getByRole("button", { name: "Book now" }).click()
    await page.waitForURL("/booking-confirmed", { timeout: 15000 })

    // The confirmation page formats dates with formatLongDate → "9. May"
    // Read the rendered values directly from the page rather than
    // trying to cross-convert the calendar's DD.MM.YYYY format.
    const detailValues = page.locator(".booking-confirmation__detail-value")
    const checkInText = (await detailValues.first().textContent())?.trim() ?? ""
    const checkOutText = (await detailValues.nth(1).textContent())?.trim() ?? ""

    // Verify they look like a long date: digit(s) + ". " + month name
    expect(checkInText).toMatch(/\d+\.\s+\w+/)
    expect(checkOutText).toMatch(/\d+\.\s+\w+/)
  })

  test("newly created booking appears in My Bookings", async ({ page }) => {
    await gotoVenue(page)

    // Remember the venue name
    const venueName =
      (await page.locator(".venue-detail__name").textContent()) ?? ""

    await selectDates(page)
    await page.getByRole("button", { name: "Book now" }).click()
    await page.waitForURL("/booking-confirmed", { timeout: 15000 })

    // Navigate to My Bookings
    await page.goto("/bookings")
    await expect(
      page
        .locator(".booking-card__name")
        .filter({ hasText: new RegExp(venueName.trim(), "i") }),
    ).toBeVisible({ timeout: 10000 })
  })
})

// ── Unauthenticated user ──────────────────────────────────────────────────────

test.describe("Venue booking (unauthenticated user)", () => {
  test("shows a sign-in prompt instead of 'Book now'", async ({ page }) => {
    if (VENUE_ID) {
      await page.goto(`/venue/${VENUE_ID}`)
    } else {
      await page.goto("/")
      await page.locator(".venue-card").first().click()
    }

    await expect(page.locator(".bc")).toBeVisible({ timeout: 10000 })

    // Select dates to trigger the summary panel
    const available = page.locator(".bc__day--available")
    await available.first().click()
    await available.nth(2).click()
    await expect(page.locator(".bc__summary")).toBeVisible()

    // Should see a login link in the calendar prompt, not a "Book now" button
    await expect(
      page.locator(".bc__login-prompt").getByRole("link", { name: /sign in/i }),
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Book now" }),
    ).not.toBeVisible()
  })
})
