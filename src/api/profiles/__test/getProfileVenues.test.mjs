import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetchData = vi.fn();
vi.mock("../../utils/fetchdata.mjs", () => ({ fetchData: mockFetchData }));

const { getProfileVenues } = await import("../getProfileVenues.mjs");

// ─── fixtures ─────────────────────────────────────────────────────────────────

const mockVenues = [
  { id: "v1", name: "Beach House", bookings: [] },
  { id: "v2", name: "Mountain Cabin", bookings: [] },
];

function mockOkResponse(data) {
  return { ok: true, json: async () => ({ data }) };
}

function mockErrorResponse(errors = [{ message: "Something went wrong" }]) {
  return { ok: false, json: async () => ({ errors }) };
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("getProfileVenues()", () => {
  beforeEach(() => mockFetchData.mockReset());

  it("calls the correct URL including _owner=true and _bookings=true", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(mockVenues));

    await getProfileVenues("testuser");

    const url = mockFetchData.mock.calls[0][0];
    expect(url).toContain("/holidaze/profiles/testuser/venues");
    expect(url).toContain("_owner=true");
    expect(url).toContain("_bookings=true");
  });

  it("URL-encodes special characters in the name", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(mockVenues));

    await getProfileVenues("test user");

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("test%20user"),
    );
  });

  it("returns the array of venues from the API", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(mockVenues));

    const result = await getProfileVenues("testuser");

    expect(result).toEqual(mockVenues);
  });

  it("throws the API error message on failure", async () => {
    mockFetchData.mockResolvedValue(
      mockErrorResponse([{ message: "Forbidden" }]),
    );

    await expect(getProfileVenues("testuser")).rejects.toThrow("Forbidden");
  });

  it("throws the fallback message when errors array is empty", async () => {
    mockFetchData.mockResolvedValue(mockErrorResponse([]));

    await expect(getProfileVenues("testuser")).rejects.toThrow(
      "We couldn't load your venues right now. Please try again.",
    );
  });
});
