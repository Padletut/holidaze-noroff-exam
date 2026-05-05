import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetchData = vi.fn();
vi.mock("../../utils/fetchdata.mjs", () => ({ fetchData: mockFetchData }));

const { getProfileBookings } = await import("../getProfileBookings.mjs");

// ─── fixtures ─────────────────────────────────────────────────────────────────

const mockBookings = [
  { id: "b1", dateFrom: "2026-06-01", dateTo: "2026-06-05", venue: { id: "v1", name: "Beach House" } },
  { id: "b2", dateFrom: "2026-07-10", dateTo: "2026-07-15", venue: { id: "v2", name: "Mountain Cabin" } },
];

function mockOkResponse(data) {
  return { ok: true, json: async () => ({ data }) };
}

function mockErrorResponse(errors = [{ message: "Something went wrong" }]) {
  return { ok: false, json: async () => ({ errors }) };
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("getProfileBookings()", () => {
  beforeEach(() => mockFetchData.mockReset());

  it("calls the correct URL including _venue=true", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(mockBookings));

    await getProfileBookings("testuser");

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("/holidaze/profiles/testuser/bookings?_venue=true"),
    );
  });

  it("URL-encodes special characters in the name", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(mockBookings));

    await getProfileBookings("test user");

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("test%20user"),
    );
  });

  it("returns the array of bookings from the API", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(mockBookings));

    const result = await getProfileBookings("testuser");

    expect(result).toEqual(mockBookings);
  });

  it("throws the API error message on failure", async () => {
    mockFetchData.mockResolvedValue(
      mockErrorResponse([{ message: "Unauthorized" }]),
    );

    await expect(getProfileBookings("testuser")).rejects.toThrow("Unauthorized");
  });

  it("throws the fallback message when errors array is empty", async () => {
    mockFetchData.mockResolvedValue(mockErrorResponse([]));

    await expect(getProfileBookings("testuser")).rejects.toThrow(
      "We couldn't load your bookings right now. Please try again.",
    );
  });
});
