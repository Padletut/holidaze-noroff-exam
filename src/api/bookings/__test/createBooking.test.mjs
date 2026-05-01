import { vi, describe, it, expect, beforeEach } from "vitest"
import { createBooking } from "../createBooking.mjs"
import { fetchData } from "../../utils/fetchdata.mjs"

vi.mock("../../utils/fetchdata.mjs")
vi.mock("../config.mjs", () => ({ BASE_URL: "https://test.noroff.dev/api/v2" }))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeResponse(ok, status, body) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  }
}

const VALID_BOOKING = {
  dateFrom: "2025-06-01",
  dateTo: "2025-06-07",
  guests: 2,
  venueId: "venue-abc-123",
}

const BOOKING_RESPONSE = {
  id: "booking-xyz-456",
  dateFrom: "2025-06-01",
  dateTo: "2025-06-07",
  guests: 2,
  venueId: "venue-abc-123",
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("createBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // --- happy path -----------------------------------------------------------

  it("returns json.data on a successful 201 response", async () => {
    fetchData.mockResolvedValue(
      makeResponse(true, 201, { data: BOOKING_RESPONSE }),
    )

    const result = await createBooking(VALID_BOOKING)

    expect(result).toEqual(BOOKING_RESPONSE)
  })

  it("returns json.data on a 200 OK response", async () => {
    fetchData.mockResolvedValue(
      makeResponse(true, 200, { data: BOOKING_RESPONSE }),
    )

    const result = await createBooking(VALID_BOOKING)

    expect(result).toEqual(BOOKING_RESPONSE)
  })

  // --- correct request shape ------------------------------------------------

  it("calls fetchData with a URL containing the bookings path", async () => {
    fetchData.mockResolvedValue(
      makeResponse(true, 201, { data: BOOKING_RESPONSE }),
    )

    await createBooking(VALID_BOOKING)

    expect(fetchData).toHaveBeenCalledWith(
      expect.stringContaining("/holidaze/bookings"),
      expect.any(Object),
    )
  })

  it("calls fetchData with method POST", async () => {
    fetchData.mockResolvedValue(
      makeResponse(true, 201, { data: BOOKING_RESPONSE }),
    )

    await createBooking(VALID_BOOKING)

    expect(fetchData).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: "POST" }),
    )
  })

  it("serialises all booking fields in the request body", async () => {
    fetchData.mockResolvedValue(
      makeResponse(true, 201, { data: BOOKING_RESPONSE }),
    )

    await createBooking(VALID_BOOKING)

    const [, options] = fetchData.mock.calls[0]
    const body = JSON.parse(options.body)

    expect(body).toEqual({
      dateFrom: "2025-06-01",
      dateTo: "2025-06-07",
      guests: 2,
      venueId: "venue-abc-123",
    })
  })

  it("is called exactly once per invocation", async () => {
    fetchData.mockResolvedValue(
      makeResponse(true, 201, { data: BOOKING_RESPONSE }),
    )

    await createBooking(VALID_BOOKING)

    expect(fetchData).toHaveBeenCalledTimes(1)
  })

  // --- error handling -------------------------------------------------------

  it("throws the first errors[0].message when response is not ok", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 400, {
        errors: [{ message: "Invalid date range: dateFrom must be before dateTo" }],
      }),
    )

    await expect(createBooking(VALID_BOOKING)).rejects.toThrow(
      "Invalid date range: dateFrom must be before dateTo",
    )
  })

  it("throws the fallback message when errors array is absent", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 500, {}),
    )

    await expect(createBooking(VALID_BOOKING)).rejects.toThrow(
      "We couldn't complete your booking right now. Please try again.",
    )
  })

  it("throws the fallback message when errors array is empty", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 400, { errors: [] }),
    )

    await expect(createBooking(VALID_BOOKING)).rejects.toThrow(
      "We couldn't complete your booking right now. Please try again.",
    )
  })

  it("throws the fallback message when errors is null", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 400, { errors: null }),
    )

    await expect(createBooking(VALID_BOOKING)).rejects.toThrow(
      "We couldn't complete your booking right now. Please try again.",
    )
  })

  it("throws the fallback message when errors is undefined", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 400, { errors: undefined }),
    )

    await expect(createBooking(VALID_BOOKING)).rejects.toThrow(
      "We couldn't complete your booking right now. Please try again.",
    )
  })

  it("uses only the first message when multiple errors are present", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 400, {
        errors: [
          { message: "First error message" },
          { message: "Second error message" },
        ],
      }),
    )

    await expect(createBooking(VALID_BOOKING)).rejects.toThrow(
      "First error message",
    )
  })

  it("does not throw for a successful response with extra fields in data", async () => {
    const extendedData = { ...BOOKING_RESPONSE, venue: { name: "Beach House" } }
    fetchData.mockResolvedValue(
      makeResponse(true, 201, { data: extendedData }),
    )

    const result = await createBooking(VALID_BOOKING)

    expect(result).toEqual(extendedData)
  })

  it("propagates a network-level rejection from fetchData", async () => {
    fetchData.mockRejectedValue(new Error("Network error"))

    await expect(createBooking(VALID_BOOKING)).rejects.toThrow("Network error")
  })
})
