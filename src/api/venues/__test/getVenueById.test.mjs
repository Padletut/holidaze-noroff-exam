import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const { getVenueById } = await import("../getVenueById.mjs");

// ─── fixtures ─────────────────────────────────────────────────────────────────

const mockVenue = {
  id: "venue-1",
  name: "Beach House",
  description: "A lovely beach house",
  price: 150,
  maxGuests: 4,
  meta: { wifi: true, parking: false, breakfast: false, pets: true },
  location: { city: "Oslo", country: "Norway" },
};

function mockOkFetch(payload) {
  return { ok: true, json: async () => payload };
}

function mockErrorFetch(status = 500) {
  return { ok: false, status, json: async () => ({}) };
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("getVenueById()", () => {
  beforeEach(() => mockFetch.mockReset());

  it("fetches the correct venue URL including _bookings, _owner and _customer flags", async () => {
    mockFetch.mockResolvedValue(mockOkFetch({ data: mockVenue }));

    await getVenueById("venue-1");

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain("/holidaze/venues/venue-1");
    expect(url).toContain("_bookings=true");
    expect(url).toContain("_owner=true");
    expect(url).toContain("_customer=true");
  });

  it("returns the full API response object", async () => {
    const payload = { data: mockVenue };
    mockFetch.mockResolvedValue(mockOkFetch(payload));

    const result = await getVenueById("venue-1");

    expect(result).toEqual(payload);
  });

  it("throws when the venue is not found (404)", async () => {
    mockFetch.mockResolvedValue(mockErrorFetch(404));

    await expect(getVenueById("nonexistent")).rejects.toThrow(
      "We couldn't load this venue right now. Please try again.",
    );
  });

  it("throws when the response is not ok", async () => {
    mockFetch.mockResolvedValue(mockErrorFetch(500));

    await expect(getVenueById("venue-1")).rejects.toThrow(
      "We couldn't load this venue right now. Please try again.",
    );
  });

  it("propagates a network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    const error = await getVenueById("venue-1").catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Failed to fetch");
  });
});
