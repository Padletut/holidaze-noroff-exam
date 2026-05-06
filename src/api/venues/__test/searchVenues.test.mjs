import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const { searchVenues } = await import("../searchVenues.mjs");

// ─── fixtures ─────────────────────────────────────────────────────────────────

const mockVenue = { id: "venue-1", name: "Beach House" };

function mockOkFetch(payload) {
  return { ok: true, json: async () => payload };
}

function mockErrorFetch(status = 500) {
  return { ok: false, status, json: async () => ({}) };
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("searchVenues()", () => {
  beforeEach(() => mockFetch.mockReset());

  it("calls the search endpoint with the encoded query", async () => {
    mockFetch.mockResolvedValue(mockOkFetch({ data: [mockVenue] }));

    await searchVenues("beach");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/holidaze/venues/search?q=beach"),
    );
  });

  it("URL-encodes special characters in the query", async () => {
    mockFetch.mockResolvedValue(mockOkFetch({ data: [] }));

    await searchVenues("beach house & pool");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("beach%20house%20%26%20pool"),
    );
  });

  it("returns the full search response from the API", async () => {
    const payload = { data: [mockVenue] };
    mockFetch.mockResolvedValue(mockOkFetch(payload));

    const result = await searchVenues("beach");

    expect(result).toEqual(payload);
  });

  it("returns an empty data array when no venues match", async () => {
    const payload = { data: [] };
    mockFetch.mockResolvedValue(mockOkFetch(payload));

    const result = await searchVenues("xyznonexistent");

    expect(result).toEqual(payload);
  });

  it("throws when the response is not ok", async () => {
    mockFetch.mockResolvedValue(mockErrorFetch(500));

    await expect(searchVenues("beach")).rejects.toThrow(
      "We couldn't complete your search right now. Please try again.",
    );
  });

  it("propagates a network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    const error = await searchVenues("beach").catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Failed to fetch");
  });
});
