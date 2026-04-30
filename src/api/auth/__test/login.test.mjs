import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetchData = vi.fn();
vi.mock("../../utils/fetchdata.mjs", () => ({ fetchData: mockFetchData }));

const mockSaveStorage = vi.fn();
vi.mock("../../../utils/saveStorage.mjs", () => ({ saveStorage: mockSaveStorage }));

const { login } = await import("../login.mjs");

// ─── helpers ──────────────────────────────────────────────────────────────────

const validCredentials = {
  email: "test@stud.noroff.no",
  password: "securepass123",
};

const mockProfile = {
  accessToken: "tok_abc123",
  name: "testuser",
  email: "test@stud.noroff.no",
};

function mockOkResponse(data = mockProfile) {
  return { ok: true, json: async () => ({ data }) };
}

function mockErrorResponse(errors = [{ message: "Something went wrong" }]) {
  return { ok: false, json: async () => ({ errors }) };
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("login()", () => {
  beforeEach(() => {
    mockFetchData.mockReset();
    mockSaveStorage.mockReset();
  });

  describe("successful login", () => {
    it("sends a POST request to /auth/login with the provided credentials", async () => {
      mockFetchData.mockResolvedValue(mockOkResponse());

      await login(validCredentials);

      expect(mockFetchData).toHaveBeenCalledTimes(1);
      expect(mockFetchData).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(validCredentials),
        }),
      );
    });

    it("saves the access token to localStorage", async () => {
      mockFetchData.mockResolvedValue(mockOkResponse());

      await login(validCredentials);

      expect(mockSaveStorage).toHaveBeenCalledWith("accessToken", mockProfile.accessToken);
    });

    it("saves the full profile to localStorage", async () => {
      mockFetchData.mockResolvedValue(mockOkResponse());

      await login(validCredentials);

      expect(mockSaveStorage).toHaveBeenCalledWith("profile", mockProfile);
    });

    it("returns the profile data from the API", async () => {
      mockFetchData.mockResolvedValue(mockOkResponse());

      const result = await login(validCredentials);

      expect(result).toEqual(mockProfile);
    });
  });

  describe("failed login", () => {
    it("throws an error with the API error message", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Invalid email or password" }]),
      );

      await expect(login(validCredentials)).rejects.toThrow("Invalid email or password");
    });

    it("throws the fallback message when errors array is empty", async () => {
      mockFetchData.mockResolvedValue(mockErrorResponse([]));

      await expect(login(validCredentials)).rejects.toThrow(
        "We couldn't sign you in right now. Please try again.",
      );
    });

    it("throws the fallback message when there is no errors property", async () => {
      mockFetchData.mockResolvedValue({ ok: false, json: async () => ({}) });

      await expect(login(validCredentials)).rejects.toThrow(
        "We couldn't sign you in right now. Please try again.",
      );
    });

    it("does not write to localStorage on failure", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Unauthorized" }]),
      );

      await expect(login(validCredentials)).rejects.toThrow();
      expect(mockSaveStorage).not.toHaveBeenCalled();
    });
  });
});
