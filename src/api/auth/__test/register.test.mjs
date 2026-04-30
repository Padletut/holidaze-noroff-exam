import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetchData = vi.fn();
vi.mock("../../utils/fetchdata.mjs", () => ({ fetchData: mockFetchData }));

const { register } = await import("../register.mjs");

// ─── helpers ──────────────────────────────────────────────────────────────────

const validInput = {
  name: "newuser",
  email: "newuser@stud.noroff.no",
  password: "securepass123",
};

const mockProfile = {
  name: "newuser",
  email: "newuser@stud.noroff.no",
};

function mockOkResponse(data = mockProfile) {
  return { ok: true, json: async () => ({ data }) };
}

function mockErrorResponse(errors = [{ message: "Something went wrong" }]) {
  return { ok: false, json: async () => ({ errors }) };
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("register()", () => {
  beforeEach(() => {
    mockFetchData.mockReset();
  });

  describe("successful registration", () => {
    it("sends a POST request to /auth/register with user data", async () => {
      mockFetchData.mockResolvedValue(mockOkResponse());

      await register(validInput);

      expect(mockFetchData).toHaveBeenCalledTimes(1);
      expect(mockFetchData).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ ...validInput, venueManager: false }),
        }),
      );
    });

    it("defaults venueManager to false when not provided", async () => {
      mockFetchData.mockResolvedValue(mockOkResponse());

      await register(validInput);

      const body = JSON.parse(mockFetchData.mock.calls[0][1].body);
      expect(body.venueManager).toBe(false);
    });

    it("sends venueManager: true when explicitly set", async () => {
      mockFetchData.mockResolvedValue(
        mockOkResponse({ ...mockProfile, venueManager: true }),
      );

      await register({ ...validInput, venueManager: true });

      const body = JSON.parse(mockFetchData.mock.calls[0][1].body);
      expect(body.venueManager).toBe(true);
    });

    it("returns the newly created profile", async () => {
      mockFetchData.mockResolvedValue(mockOkResponse());

      const result = await register(validInput);

      expect(result).toEqual(mockProfile);
    });

    it("does not store any auth tokens (login is a separate step)", async () => {
      mockFetchData.mockResolvedValue(mockOkResponse());

      await register(validInput);

      expect(mockFetchData).toHaveBeenCalledTimes(1);
    });
  });

  describe("failed registration", () => {
    it("throws an error with the API error message", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Profile already exists" }]),
      );

      await expect(register(validInput)).rejects.toThrow("Profile already exists");
    });

    it("throws the fallback message when errors array is empty", async () => {
      mockFetchData.mockResolvedValue(mockErrorResponse([]));

      await expect(register(validInput)).rejects.toThrow(
        "We couldn't create your account right now. Please try again.",
      );
    });

    it("throws the fallback message when there is no errors property", async () => {
      mockFetchData.mockResolvedValue({ ok: false, json: async () => ({}) });

      await expect(register(validInput)).rejects.toThrow(
        "We couldn't create your account right now. Please try again.",
      );
    });
  });
});
