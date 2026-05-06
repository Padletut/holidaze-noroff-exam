import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetchData = vi.fn();
vi.mock("../../utils/fetchdata.mjs", () => ({ fetchData: mockFetchData }));

const { updateVenue } = await import("../updateVenue.mjs");

// ─── fixtures ─────────────────────────────────────────────────────────────────

const mockVenuePayload = {
  name: "Beach House",
  description: "A lovely beach house",
  price: 150,
  maxGuests: 4,
  meta: { wifi: true, parking: false, breakfast: false, pets: true },
  location: { city: "Oslo", country: "Norway" },
};

const updatedPayload = { ...mockVenuePayload, price: 200 };
const updatedVenue = { id: "venue-1", ...updatedPayload };

function mockOkFetchData(data) {
  return { ok: true, json: async () => ({ data }) };
}

function mockErrorFetchData(errors = [{ message: "Something went wrong" }]) {
  return { ok: false, json: async () => ({ errors }) };
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("updateVenue()", () => {
  beforeEach(() => mockFetchData.mockReset());

  it("sends a PUT request to the correct venue URL", async () => {
    mockFetchData.mockResolvedValue(mockOkFetchData(updatedVenue));

    await updateVenue("venue-1", updatedPayload);

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("/holidaze/venues/venue-1"),
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("URL-encodes special characters in the venue ID", async () => {
    mockFetchData.mockResolvedValue(mockOkFetchData(updatedVenue));

    await updateVenue("venue 1", updatedPayload);

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("venue%201"),
      expect.anything(),
    );
  });

  it("serialises the updated payload as JSON", async () => {
    mockFetchData.mockResolvedValue(mockOkFetchData(updatedVenue));

    await updateVenue("venue-1", updatedPayload);

    const options = mockFetchData.mock.calls[0][1];
    expect(options.body).toBe(JSON.stringify(updatedPayload));
  });

  it("returns the updated venue object", async () => {
    mockFetchData.mockResolvedValue(mockOkFetchData(updatedVenue));

    const result = await updateVenue("venue-1", updatedPayload);

    expect(result).toEqual(updatedVenue);
  });

  it("throws the API error message on failure", async () => {
    mockFetchData.mockResolvedValue(
      mockErrorFetchData([{ message: "You are not the owner of this venue" }]),
    );

    await expect(updateVenue("venue-1", updatedPayload)).rejects.toThrow(
      "You are not the owner of this venue",
    );
  });

  it("throws the fallback message when errors array is empty", async () => {
    mockFetchData.mockResolvedValue(mockErrorFetchData([]));

    await expect(updateVenue("venue-1", updatedPayload)).rejects.toThrow(
      "We couldn't update the venue right now. Please try again.",
    );
  });

  it("throws the fallback message when there is no errors property", async () => {
    mockFetchData.mockResolvedValue({ ok: false, json: async () => ({}) });

    await expect(updateVenue("venue-1", updatedPayload)).rejects.toThrow(
      "We couldn't update the venue right now. Please try again.",
    );
  });

  it("propagates a network error", async () => {
    mockFetchData.mockRejectedValueOnce(new Error("Failed to fetch"));

    const error = await updateVenue("venue-1", updatedPayload).catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Failed to fetch");
  });
});
