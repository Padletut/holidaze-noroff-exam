import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetchData = vi.fn();
vi.mock("../../utils/fetchdata.mjs", () => ({ fetchData: mockFetchData }));

const { createVenue } = await import("../createVenue.mjs");

// ─── fixtures ─────────────────────────────────────────────────────────────────

const mockVenuePayload = {
  name: "Beach House",
  description: "A lovely beach house",
  price: 150,
  maxGuests: 4,
  meta: { wifi: true, parking: false, breakfast: false, pets: true },
  location: { city: "Oslo", country: "Norway" },
};

const mockVenue = { id: "venue-1", ...mockVenuePayload };

function mockOkFetchData(data) {
  return { ok: true, json: async () => ({ data }) };
}

function mockErrorFetchData(errors = [{ message: "Something went wrong" }]) {
  return { ok: false, json: async () => ({ errors }) };
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("createVenue()", () => {
  beforeEach(() => mockFetchData.mockReset());

  it("sends a POST request to /holidaze/venues", async () => {
    mockFetchData.mockResolvedValue(mockOkFetchData(mockVenue));

    await createVenue(mockVenuePayload);

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("/holidaze/venues"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("serialises the venue payload as JSON", async () => {
    mockFetchData.mockResolvedValue(mockOkFetchData(mockVenue));

    await createVenue(mockVenuePayload);

    const options = mockFetchData.mock.calls[0][1];
    expect(options.body).toBe(JSON.stringify(mockVenuePayload));
  });

  it("returns the created venue object", async () => {
    mockFetchData.mockResolvedValue(mockOkFetchData(mockVenue));

    const result = await createVenue(mockVenuePayload);

    expect(result).toEqual(mockVenue);
  });

  it("throws the API error message on failure", async () => {
    mockFetchData.mockResolvedValue(
      mockErrorFetchData([{ message: "You must be a venue manager to create venues" }]),
    );

    await expect(createVenue(mockVenuePayload)).rejects.toThrow(
      "You must be a venue manager to create venues",
    );
  });

  it("throws the fallback message when errors array is empty", async () => {
    mockFetchData.mockResolvedValue(mockErrorFetchData([]));

    await expect(createVenue(mockVenuePayload)).rejects.toThrow(
      "We couldn't create the venue right now. Please try again.",
    );
  });

  it("throws the fallback message when there is no errors property", async () => {
    mockFetchData.mockResolvedValue({ ok: false, json: async () => ({}) });

    await expect(createVenue(mockVenuePayload)).rejects.toThrow(
      "We couldn't create the venue right now. Please try again.",
    );
  });

  it("propagates a network error", async () => {
    mockFetchData.mockRejectedValueOnce(new Error("Failed to fetch"));

    const error = await createVenue(mockVenuePayload).catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Failed to fetch");
  });
});
