import { vi, describe, it, expect, beforeEach } from "vitest"
import { updateBooking } from "../updateBooking.mjs"
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

const BOOKING_ID = "booking-xyz-456"
const ENCODED_ID = encodeURIComponent(BOOKING_ID)

const UPDATE_DATA = {
  dateFrom: "2025-07-01",
  dateTo: "2025-07-10",
  guests: 3,
}

const UPDATED_BOOKING = {
  id: BOOKING_ID,
  dateFrom: "2025-07-01",
  dateTo: "2025-07-10",
  guests: 3,
  venueId: "venue-abc-123",
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("updateBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // --- happy path -----------------------------------------------------------

  it("returns json.data on a successful 200 response", async () => {
    fetchData.mockResolvedValue(
      makeResponse(true, 200, { data: UPDATED_BOOKING }),
    )

    const result = await updateBooking(BOOKING_ID, UPDATE_DATA)

    expect(result).toEqual(UPDATED_BOOKING)
  })

  // --- correct request shape ------------------------------------------------

  it("calls fetchData with a URL containing the booking ID path", async () => {
    fetchData.mockResolvedValue(
      makeResponse(true, 200, { data: UPDATED_BOOKING }),
    )

    await updateBooking(BOOKING_ID, UPDATE_DATA)

    expect(fetchData).toHaveBeenCalledWith(
      expect.stringContaining(`/holidaze/bookings/${ENCODED_ID}`),
      expect.any(Object),
    )
  })

  it("URL-encodes a booking ID that contains special characters", async () => {
    const specialId = "booking/with spaces&chars"
    fetchData.mockResolvedValue(
      makeResponse(true, 200, { data: UPDATED_BOOKING }),
    )

    await updateBooking(specialId, UPDATE_DATA)

    const [calledUrl] = fetchData.mock.calls[0]
    expect(calledUrl).toContain(encodeURIComponent(specialId))
    expect(calledUrl).not.toContain(specialId)
  })

  it("calls fetchData with method PUT", async () => {
    fetchData.mockResolvedValue(
      makeResponse(true, 200, { data: UPDATED_BOOKING }),
    )

    await updateBooking(BOOKING_ID, UPDATE_DATA)

    expect(fetchData).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: "PUT" }),
    )
  })

  it("serialises all provided fields in the request body", async () => {
    fetchData.mockResolvedValue(
      makeResponse(true, 200, { data: UPDATED_BOOKING }),
    )

    await updateBooking(BOOKING_ID, UPDATE_DATA)

    const [, options] = fetchData.mock.calls[0]
    const body = JSON.parse(options.body)

    expect(body).toEqual({
      dateFrom: "2025-07-01",
      dateTo: "2025-07-10",
      guests: 3,
    })
  })

  it("supports a partial update with only dateFrom", async () => {
    const partial = { dateFrom: "2025-07-05" }
    fetchData.mockResolvedValue(
      makeResponse(true, 200, { data: { ...UPDATED_BOOKING, dateFrom: "2025-07-05" } }),
    )

    await updateBooking(BOOKING_ID, partial)

    const [, options] = fetchData.mock.calls[0]
    const body = JSON.parse(options.body)

    expect(body).toEqual({ dateFrom: "2025-07-05" })
  })

  it("supports a partial update with only guests", async () => {
    const partial = { guests: 5 }
    fetchData.mockResolvedValue(
      makeResponse(true, 200, { data: { ...UPDATED_BOOKING, guests: 5 } }),
    )

    const result = await updateBooking(BOOKING_ID, partial)

    expect(result.guests).toBe(5)
  })

  it("is called exactly once per invocation", async () => {
    fetchData.mockResolvedValue(
      makeResponse(true, 200, { data: UPDATED_BOOKING }),
    )

    await updateBooking(BOOKING_ID, UPDATE_DATA)

    expect(fetchData).toHaveBeenCalledTimes(1)
  })

  // --- error handling -------------------------------------------------------

  it("throws errors[0].message when response is not ok", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 400, {
        errors: [{ message: "Booking dates overlap with an existing reservation" }],
      }),
    )

    await expect(updateBooking(BOOKING_ID, UPDATE_DATA)).rejects.toThrow(
      "Booking dates overlap with an existing reservation",
    )
  })

  it("throws the fallback message when errors array is absent", async () => {
    fetchData.mockResolvedValue(makeResponse(false, 500, {}))

    await expect(updateBooking(BOOKING_ID, UPDATE_DATA)).rejects.toThrow(
      "We couldn't update your booking right now. Please try again.",
    )
  })

  it("throws the fallback message when errors array is empty", async () => {
    fetchData.mockResolvedValue(makeResponse(false, 400, { errors: [] }))

    await expect(updateBooking(BOOKING_ID, UPDATE_DATA)).rejects.toThrow(
      "We couldn't update your booking right now. Please try again.",
    )
  })

  it("throws the fallback message when errors is null", async () => {
    fetchData.mockResolvedValue(makeResponse(false, 400, { errors: null }))

    await expect(updateBooking(BOOKING_ID, UPDATE_DATA)).rejects.toThrow(
      "We couldn't update your booking right now. Please try again.",
    )
  })

  it("throws the fallback message when errors is undefined", async () => {
    fetchData.mockResolvedValue(makeResponse(false, 400, { errors: undefined }))

    await expect(updateBooking(BOOKING_ID, UPDATE_DATA)).rejects.toThrow(
      "We couldn't update your booking right now. Please try again.",
    )
  })

  it("uses only the first message when multiple errors are present", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 400, {
        errors: [
          { message: "Primary error" },
          { message: "Secondary error" },
        ],
      }),
    )

    await expect(updateBooking(BOOKING_ID, UPDATE_DATA)).rejects.toThrow(
      "Primary error",
    )
  })

  it("throws on a 404 when the booking does not exist", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 404, {
        errors: [{ message: "Booking not found" }],
      }),
    )

    await expect(updateBooking(BOOKING_ID, UPDATE_DATA)).rejects.toThrow(
      "Booking not found",
    )
  })

  it("propagates a network-level rejection from fetchData", async () => {
    fetchData.mockRejectedValue(new Error("Connection refused"))

    await expect(updateBooking(BOOKING_ID, UPDATE_DATA)).rejects.toThrow(
      "Connection refused",
    )
  })
})
