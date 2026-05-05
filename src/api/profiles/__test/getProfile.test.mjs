import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetchData = vi.fn();
vi.mock("../../utils/fetchdata.mjs", () => ({ fetchData: mockFetchData }));

const { getProfile } = await import("../getProfile.mjs");

// ─── fixtures ─────────────────────────────────────────────────────────────────

const mockProfile = {
  name: "testuser",
  email: "testuser@stud.noroff.no",
  bio: "Hello world",
  avatar: { url: "https://example.com/avatar.jpg", alt: "" },
  venueManager: false,
};

function mockOkResponse(data) {
  return { ok: true, json: async () => ({ data }) };
}

function mockErrorResponse(errors = [{ message: "Something went wrong" }]) {
  return { ok: false, json: async () => ({ errors }) };
}

// ─── tests ────────────────────────────────────────────────────────────────────

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
