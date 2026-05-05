import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetchData = vi.fn();
vi.mock("../../utils/fetchdata.mjs", () => ({ fetchData: mockFetchData }));

const { updateProfile } = await import("../updateProfile.mjs");

// ─── fixtures ─────────────────────────────────────────────────────────────────

const mockProfile = {
  name: "testuser",
  email: "testuser@stud.noroff.no",
  bio: "Hello world",
  avatar: { url: "https://example.com/avatar.jpg", alt: "" },
  venueManager: false,
};

const updateBody = { bio: "Updated bio", venueManager: true };
const updatedProfile = { ...mockProfile, bio: "Updated bio", venueManager: true };

function mockOkResponse(data) {
  return { ok: true, json: async () => ({ data }) };
}

function mockErrorResponse(errors = [{ message: "Something went wrong" }]) {
  return { ok: false, json: async () => ({ errors }) };
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("updateProfile()", () => {
  beforeEach(() => mockFetchData.mockReset());

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
