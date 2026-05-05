import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetchData = vi.fn();
vi.mock("../../utils/fetchdata.mjs", () => ({ fetchData: mockFetchData }));

const { getProfile } = await import("../getProfile.mjs");
const { getProfileBookings } = await import("../getProfileBookings.mjs");
const { getProfileVenues } = await import("../getProfileVenues.mjs");
const { updateProfile } = await import("../updateProfile.mjs");

// ─── helpers ──────────────────────────────────────────────────────────────────

function mockOkResponse(data) {
  return { ok: true, json: async () => ({ data }) };
}

function mockErrorResponse(errors = [{ message: "Something went wrong" }]) {
  return { ok: false, json: async () => ({ errors }) };
}

// ─── fixtures ─────────────────────────────────────────────────────────────────

const mockProfile = {
  name: "testuser",
  email: "testuser@stud.noroff.no",
  bio: "Hello world",
  avatar: { url: "https://example.com/avatar.jpg", alt: "" },
  venueManager: false,
};

const mockBookings = [
  { id: "b1", dateFrom: "2026-06-01", dateTo: "2026-06-05", venue: { id: "v1", name: "Beach House" } },
  { id: "b2", dateFrom: "2026-07-10", dateTo: "2026-07-15", venue: { id: "v2", name: "Mountain Cabin" } },
];

const mockVenues = [
  { id: "v1", name: "Beach House", bookings: [] },
  { id: "v2", name: "Mountain Cabin", bookings: [] },
];

// ─── getProfile ───────────────────────────────────────────────────────────────

describe("getProfile()", () => {
  beforeEach(() => mockFetchData.mockReset());

  it("calls the correct URL with the encoded profile name", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(mockProfile));

    await getProfile("testuser");

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("/holidaze/profiles/testuser"),
    );
  });

  it("URL-encodes special characters in the name", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(mockProfile));

    await getProfile("test user");

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("test%20user"),
    );
  });

  it("returns the profile data from the API", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(mockProfile));

    const result = await getProfile("testuser");

    expect(result).toEqual(mockProfile);
  });

  it("throws the API error message on failure", async () => {
    mockFetchData.mockResolvedValue(
      mockErrorResponse([{ message: "Profile not found" }]),
    );

    await expect(getProfile("testuser")).rejects.toThrow("Profile not found");
  });

  it("throws the fallback message when errors array is empty", async () => {
    mockFetchData.mockResolvedValue(mockErrorResponse([]));

    await expect(getProfile("testuser")).rejects.toThrow(
      "We couldn't load your profile right now. Please try again.",
    );
  });
});

// ─── getProfileBookings ───────────────────────────────────────────────────────

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

// ─── getProfileVenues ─────────────────────────────────────────────────────────

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

// ─── updateProfile ────────────────────────────────────────────────────────────

describe("updateProfile()", () => {
  beforeEach(() => mockFetchData.mockReset());

  const updateBody = { bio: "Updated bio", venueManager: true };
  const updatedProfile = { ...mockProfile, bio: "Updated bio", venueManager: true };

  it("sends a PUT request to the correct URL", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(updatedProfile));

    await updateProfile("testuser", updateBody);

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("/holidaze/profiles/testuser"),
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("serialises the body as JSON", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(updatedProfile));

    await updateProfile("testuser", updateBody);

    const options = mockFetchData.mock.calls[0][1];
    expect(options.body).toBe(JSON.stringify(updateBody));
  });

  it("URL-encodes special characters in the name", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(updatedProfile));

    await updateProfile("test user", updateBody);

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("test%20user"),
      expect.anything(),
    );
  });

  it("returns the updated profile from the API", async () => {
    mockFetchData.mockResolvedValue(mockOkResponse(updatedProfile));

    const result = await updateProfile("testuser", updateBody);

    expect(result).toEqual(updatedProfile);
  });

  it("throws the API error message on failure", async () => {
    mockFetchData.mockResolvedValue(
      mockErrorResponse([{ message: "Invalid profile data" }]),
    );

    await expect(updateProfile("testuser", updateBody)).rejects.toThrow(
      "Invalid profile data",
    );
  });

  it("throws the fallback message when errors array is empty", async () => {
    mockFetchData.mockResolvedValue(mockErrorResponse([]));

    await expect(updateProfile("testuser", updateBody)).rejects.toThrow(
      "We couldn't update your profile right now. Please try again.",
    );
  });
});
