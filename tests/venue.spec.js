// @ts-check
import { test, expect } from "@playwright/test"
/** @typedef {import('@playwright/test').Page} Page */
/** @typedef {import('@playwright/test').APIRequestContext} APIRequestContext */

const EMAIL = process.env.TEST_EMAIL ?? ""
const PASSWORD = process.env.TEST_PASSWORD ?? ""

// ── auth helpers ──────────────────────────────────────────────────────────────

/** @type {string} */ let _authToken = ""
/** @type {Record<string,unknown>|null} */ let _authProfile = null

/**
 * Inject cached credentials into localStorage.
 * @param {Page} page
 */
async function injectAuth(page) {
  await page.goto("/")
  await page.evaluate(
    ({ token, profile }) => {
      localStorage.setItem("accessToken", JSON.stringify(token))
      localStorage.setItem("profile", JSON.stringify(profile))
    },
    { token: _authToken, profile: _authProfile },
  )
}

// ── venue cleanup helper ──────────────────────────────────────────────────────

/**
 * Delete a venue by ID via the API.
 * @param {APIRequestContext} request
 * @param {string} venueId
 */
async function deleteVenueById(request, venueId) {
  const base = process.env.VITE_API_URL ?? ""
  const apiKey = process.env.VITE_API_KEY ?? ""
  await request.delete(`${base}/holidaze/venues/${venueId}`, {
    headers: {
      Authorization: `Bearer ${_authToken}`,
      "X-Noroff-API-Key": apiKey,
    },
  })
}

/**
 * Delete all venues owned by the test user via the API.
 * @param {APIRequestContext} request
 */
async function cleanupVenues(request) {
  if (!_authToken || !_authProfile?.name) return
  const base = process.env.VITE_API_URL ?? ""
  const apiKey = process.env.VITE_API_KEY ?? ""
  const headers = {
    Authorization: `Bearer ${_authToken}`,
    "X-Noroff-API-Key": apiKey,
  }
  const res = await request.get(
    `${base}/holidaze/profiles/${encodeURIComponent(String(_authProfile.name))}/venues`,
    { headers },
  )
  if (!res.ok()) return
  const { data: venues } = await res.json()
  for (const venue of venues ?? []) {
    await request.delete(`${base}/holidaze/venues/${venue.id}`, { headers })
  }
}

// ── test data ─────────────────────────────────────────────────────────────────

const VENUE_TITLE = `E2E Test Venue ${Date.now()}`
const UPDATED_TITLE = `${VENUE_TITLE} (updated)`

// ── suite ─────────────────────────────────────────────────────────────────────

test.describe("Venue management (venue manager)", () => {
  test.describe.configure({ mode: "serial" })
  test.skip(!EMAIL || !PASSWORD, "Set TEST_EMAIL / TEST_PASSWORD in .env")

  /** @type {string} */ let createdVenueId = ""

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
    const body = await res.json()
    if (!res.ok() || !body.data?.accessToken) {
      const msg =
        body.errors?.[0]?.message ??
        `Login failed (HTTP ${res.status()}). Check TEST_EMAIL / TEST_PASSWORD and ensure the account has venueManager: true.`
      throw new Error(msg)
    }
    _authToken = body.data.accessToken
    _authProfile = body.data
    // Wipe any leftover venues from a previously interrupted run
    await cleanupVenues(request)
  })

  test.beforeEach(async ({ page }) => {
    await injectAuth(page)
  })

  // ── form validation ───────────────────────────────────────────────────────

  test.describe("Create venue – validation", () => {
    test("shows validation error when submitting an empty form", async ({
      page,
    }) => {
      await page.goto("/venues/create")
      await expect(
        page.getByRole("heading", { name: "Create Venue" }),
      ).toBeVisible()

      await page.getByRole("button", { name: "Create" }).click()

      await expect(page.getByRole("alert")).toBeVisible()
    })

    test("shows validation error when price is missing", async ({ page }) => {
      await page.goto("/venues/create")

      await page.locator("#name").fill("My test venue")
      await page.locator("#description").fill("A description")
      // leave price empty
      await page.locator("#maxGuests").fill("4")
      await page.getByRole("button", { name: "Create" }).click()

      await expect(page.getByRole("alert")).toContainText(/price/i)
    })
  })

  // ── create ────────────────────────────────────────────────────────────────

  test("creates a new venue and redirects to My Venues", async ({
    page,
    request,
  }) => {
    await page.goto("/venues/create")

    await page.locator("#name").fill(VENUE_TITLE)
    await page
      .locator("#description")
      .fill("An E2E test venue. Safe to delete.")
    await page.locator("#price").fill("99")
    await page.locator("#maxGuests").fill("4")

    await page.getByRole("button", { name: "Create" }).click()

    // Should show a success alert before redirecting
    await expect(page.getByRole("alert")).toContainText(/created successfully/i)
    await page.waitForURL("/venues/my", { timeout: 10000 })

    // Grab the ID of the newly created venue so later tests can use it
    const base = process.env.VITE_API_URL ?? ""
    const apiKey = process.env.VITE_API_KEY ?? ""
    const res = await request.get(
      `${base}/holidaze/profiles/${encodeURIComponent(String(_authProfile?.name ?? ""))}/venues`,
      {
        headers: {
          Authorization: `Bearer ${_authToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      },
    )
    const { data: venues } = await res.json()
    const created = (venues ?? []).find(
      (/** @type {{name:string,id:string}} */ v) => v.name === VENUE_TITLE,
    )
    createdVenueId = created?.id ?? ""
  })

  test("the new venue appears on My Venues page", async ({ page }) => {
    await page.goto("/venues/my")
    await expect(
      page.getByRole("heading", { name: VENUE_TITLE, exact: false }),
    ).toBeVisible({ timeout: 10000 })
  })

  // ── update ────────────────────────────────────────────────────────────────

  test("updates the venue title and shows a success message", async ({
    page,
  }) => {
    test.skip(
      !createdVenueId,
      "Skipped: create test did not produce a venue ID",
    )

    await page.goto(`/venues/edit/${createdVenueId}`)
    await expect(
      page.getByRole("heading", { name: "Update Venue" }),
    ).toBeVisible({ timeout: 10000 })

    // Clear and retype the title
    await page.locator("#name").clear()
    await page.locator("#name").fill(UPDATED_TITLE)

    await page.getByRole("button", { name: "Update" }).click()

    await expect(page.getByRole("alert")).toContainText(/updated successfully/i)
  })

  test("updated title is persisted on the edit page", async ({ page }) => {
    test.skip(
      !createdVenueId,
      "Skipped: create test did not produce a venue ID",
    )

    await page.goto(`/venues/edit/${createdVenueId}`)
    await expect(page.locator("#name")).toHaveValue(UPDATED_TITLE, {
      timeout: 10000,
    })
  })

  // ── delete ────────────────────────────────────────────────────────────────

  test("cancel button on delete confirm keeps the venue", async ({ page }) => {
    test.skip(
      !createdVenueId,
      "Skipped: create test did not produce a venue ID",
    )

    await page.goto(`/venues/edit/${createdVenueId}`)
    await page.getByRole("button", { name: "Delete" }).click()

    // Confirmation dialog should appear
    await expect(
      page.getByText(/are you sure you want to delete/i),
    ).toBeVisible()

    // Clicking "Keep venue" should dismiss the dialog
    await page.getByRole("button", { name: "Keep venue" }).click()
    await expect(
      page.getByText(/are you sure you want to delete/i),
    ).not.toBeVisible()
  })

  test("deletes the venue and redirects to My Venues", async ({
    page,
    request,
  }) => {
    test.skip(
      !createdVenueId,
      "Skipped: create test did not produce a venue ID",
    )

    await page.goto(`/venues/edit/${createdVenueId}`)
    await page.getByRole("button", { name: "Delete" }).click()
    await page.getByRole("button", { name: "Yes, delete" }).click()

    await page.waitForURL("/venues/my", { timeout: 10000 })

    // Clean up the ID so afterAll doesn't try to delete it a second time
    const deletedId = createdVenueId
    createdVenueId = ""

    // Verify it's gone via the API
    const base = process.env.VITE_API_URL ?? ""
    const apiKey = process.env.VITE_API_KEY ?? ""
    const res = await request.get(`${base}/holidaze/venues/${deletedId}`, {
      headers: {
        Authorization: `Bearer ${_authToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    })
    expect(res.status()).toBe(404)
  })

  // Safety net: remove anything left behind by a failing test
  test.afterAll(async ({ request }) => {
    if (createdVenueId) await deleteVenueById(request, createdVenueId)
  })
})
