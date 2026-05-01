import { vi, describe, it, expect, beforeEach } from "vitest"
import { deleteBooking } from "../deleteBooking.mjs"
import { fetchData } from "../../utils/fetchdata.mjs"

vi.mock("../../utils/fetchdata.mjs")
vi.mock("../config.mjs", () => ({ BASE_URL: "https://test.noroff.dev/api/v2" }))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeResponse(ok, status, body = null) {
  return {
    ok,
    status,
    json: body !== null
      ? vi.fn().mockResolvedValue(body)
      : vi.fn().mockRejectedValue(new SyntaxError("Unexpected end of JSON input")),
  }
}

const BOOKING_ID = "booking-xyz-456"
const ENCODED_ID = encodeURIComponent(BOOKING_ID)

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("deleteBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // --- happy path -----------------------------------------------------------

  it("resolves without a value on a successful 204 response (no body)", async () => {
    fetchData.mockResolvedValue(makeResponse(true, 204))

    const result = await deleteBooking(BOOKING_ID)

    expect(result).toBeUndefined()
  })

  it("resolves without a value on a 200 OK response", async () => {
    fetchData.mockResolvedValue(makeResponse(true, 200, {}))

    const result = await deleteBooking(BOOKING_ID)

    expect(result).toBeUndefined()
  })

  // --- correct request shape ------------------------------------------------

  it("calls fetchData with a URL containing the booking ID path", async () => {
    fetchData.mockResolvedValue(makeResponse(true, 204))

    await deleteBooking(BOOKING_ID)

    expect(fetchData).toHaveBeenCalledWith(
      expect.stringContaining(`/holidaze/bookings/${ENCODED_ID}`),
      expect.any(Object),
    )
  })

  it("URL-encodes a booking ID that contains special characters", async () => {
    const specialId = "booking/with spaces&chars"
    fetchData.mockResolvedValue(makeResponse(true, 204))

    await deleteBooking(specialId)

    const [calledUrl] = fetchData.mock.calls[0]
    expect(calledUrl).toContain(encodeURIComponent(specialId))
    expect(calledUrl).not.toContain(specialId)
  })

  it("calls fetchData with method DELETE", async () => {
    fetchData.mockResolvedValue(makeResponse(true, 204))

    await deleteBooking(BOOKING_ID)

    expect(fetchData).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: "DELETE" }),
    )
  })

  it("does not send a request body", async () => {
    fetchData.mockResolvedValue(makeResponse(true, 204))

    await deleteBooking(BOOKING_ID)

    const [, options] = fetchData.mock.calls[0]
    expect(options.body).toBeUndefined()
  })

  it("is called exactly once per invocation", async () => {
    fetchData.mockResolvedValue(makeResponse(true, 204))

    await deleteBooking(BOOKING_ID)

    expect(fetchData).toHaveBeenCalledTimes(1)
  })

  // --- error handling -------------------------------------------------------

  it("throws errors[0].message when response is not ok and body has errors", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 400, {
        errors: [{ message: "You are not authorised to delete this booking" }],
      }),
    )

    await expect(deleteBooking(BOOKING_ID)).rejects.toThrow(
      "You are not authorised to delete this booking",
    )
  })

  it("throws the fallback message when errors array is absent", async () => {
    fetchData.mockResolvedValue(makeResponse(false, 500, {}))

    await expect(deleteBooking(BOOKING_ID)).rejects.toThrow(
      "We couldn't cancel your booking right now. Please try again.",
    )
  })

  it("throws the fallback message when errors array is empty", async () => {
    fetchData.mockResolvedValue(makeResponse(false, 400, { errors: [] }))

    await expect(deleteBooking(BOOKING_ID)).rejects.toThrow(
      "We couldn't cancel your booking right now. Please try again.",
    )
  })

  it("throws the fallback message when errors is null", async () => {
    fetchData.mockResolvedValue(makeResponse(false, 400, { errors: null }))

    await expect(deleteBooking(BOOKING_ID)).rejects.toThrow(
      "We couldn't cancel your booking right now. Please try again.",
    )
  })

  it("throws the fallback message when the error response body is not JSON", async () => {
    // Simulates a 500 response with a non-JSON body (response.json() throws)
    fetchData.mockResolvedValue(makeResponse(false, 500))

    await expect(deleteBooking(BOOKING_ID)).rejects.toThrow(
      "We couldn't cancel your booking right now. Please try again.",
    )
  })

  it("uses only the first message when multiple errors are present", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 400, {
        errors: [
          { message: "Primary cancellation error" },
          { message: "Secondary error" },
        ],
      }),
    )

    await expect(deleteBooking(BOOKING_ID)).rejects.toThrow(
      "Primary cancellation error",
    )
  })

  it("throws on 403 Forbidden with appropriate message", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 403, {
        errors: [{ message: "Forbidden: cannot delete another user's booking" }],
      }),
    )

    await expect(deleteBooking(BOOKING_ID)).rejects.toThrow(
      "Forbidden: cannot delete another user's booking",
    )
  })

  it("throws on 404 when booking does not exist", async () => {
    fetchData.mockResolvedValue(
      makeResponse(false, 404, {
        errors: [{ message: "Booking not found" }],
      }),
    )

    await expect(deleteBooking(BOOKING_ID)).rejects.toThrow("Booking not found")
  })

  it("propagates a network-level rejection from fetchData", async () => {
    fetchData.mockRejectedValue(new Error("Network failure"))

    await expect(deleteBooking(BOOKING_ID)).rejects.toThrow("Network failure")
  })
})
