import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const { getVenues } = await import("../getVenues.mjs");

// ─── fixtures ─────────────────────────────────────────────────────────────────

const mockVenueList = {
  data: [
    { id: "venue-1", name: "Beach House" },
    { id: "venue-2", name: "Mountain Cabin" },
  ],
  meta: { totalCount: 20, totalPages: 2, currentPage: 1, pageSize: 12 },
};

function mockOkFetch(payload) {
  return { ok: true, json: async () => payload };
}

function mockErrorFetch(status = 500) {
  return { ok: false, status, json: async () => ({}) };
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("getVenues()", () => {
  beforeEach(() => mockFetch.mockReset());

  it("fetches page 1 with limit 12 by default", async () => {
    mockFetch.mockResolvedValue(mockOkFetch(mockVenueList));

    await getVenues();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("page=1"),
      {},
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=12"),
      {},
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("sort=updated"),
      {},
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("sortOrder=asc"),
      {},
    );
  });

  it("accepts custom page and limit arguments", async () => {
    mockFetch.mockResolvedValue(mockOkFetch(mockVenueList));

    await getVenues(3, 24);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("page=3"),
      {},
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=24"),
      {},
    );
  });

  it("passes optional fetch options through to fetch", async () => {
    mockFetch.mockResolvedValue(mockOkFetch(mockVenueList));
    const options = { signal: new AbortController().signal };

    await getVenues(1, 12, options);

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), options);
  });

  it("calls the /holidaze/venues endpoint", async () => {
    mockFetch.mockResolvedValue(mockOkFetch(mockVenueList));

    await getVenues();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/holidaze/venues"),
      {},
    );
  });

  it("returns the full paginated API response", async () => {
    mockFetch.mockResolvedValue(mockOkFetch(mockVenueList));

    const result = await getVenues();

    expect(result).toEqual(mockVenueList);
  });

  it("throws when the response is not ok", async () => {
    mockFetch.mockResolvedValue(mockErrorFetch(500));

    await expect(getVenues()).rejects.toThrow(
      "We couldn't load venues right now. Please try again.",
    );
  });

  it("propagates a network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    const error = await getVenues().catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Failed to fetch");
  });
});
