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

    it("returns the profile data from the API", async () => {
      mockFetchData.mockResolvedValue(mockOkResponse());

      const result = await login(validCredentials);

      expect(result).toEqual(mockProfile);
    });

    it("saves exactly accessToken then profile — in that order", async () => {
      mockFetchData.mockResolvedValue(mockOkResponse());

      await login(validCredentials);

      expect(mockSaveStorage).toHaveBeenCalledTimes(2);
      expect(mockSaveStorage).toHaveBeenNthCalledWith(1, "accessToken", mockProfile.accessToken);
      expect(mockSaveStorage).toHaveBeenNthCalledWith(2, "profile", mockProfile);
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

  describe("invalid credentials", () => {
    it("throws on 401 when the password is wrong", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Invalid email or password" }]),
      );

      await expect(
        login({ email: "test@stud.noroff.no", password: "wrongpassword" }),
      ).rejects.toThrow("Invalid email or password");
    });

    it("throws on 401 when the user does not exist", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Invalid email or password" }]),
      );

      await expect(
        login({ email: "nobody@stud.noroff.no", password: "somepassword" }),
      ).rejects.toThrow("Invalid email or password");
    });

    it("still sends the request even when the email is not a stud.noroff.no address (server validates)", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Email must be a valid stud.noroff.no address" }]),
      );

      await expect(
        login({ email: "user@gmail.com", password: "securepass123" }),
      ).rejects.toThrow("Email must be a valid stud.noroff.no address");

      const body = JSON.parse(mockFetchData.mock.calls[0][1].body);
      expect(body.email).toBe("user@gmail.com");
    });

    it("throws on 401 when password is too short and rejected by the server", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Password must be at least 8 characters" }]),
      );

      await expect(
        login({ email: "test@stud.noroff.no", password: "short" }),
      ).rejects.toThrow("Password must be at least 8 characters");
    });

    it("throws on 403 when the account is banned or locked", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Your account has been suspended" }]),
      );

      await expect(login(validCredentials)).rejects.toThrow(
        "Your account has been suspended",
      );
    });

    it("propagates a network error", async () => {
      mockFetchData.mockRejectedValue(new Error("Failed to fetch"));

      await expect(login(validCredentials)).rejects.toThrow("Failed to fetch");
      expect(mockSaveStorage).not.toHaveBeenCalled();
    });
  });
});
