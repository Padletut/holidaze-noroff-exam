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
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

      mockFetchData.mockResolvedValue(mockOkResponse());

      await register(validInput);

      expect(setItemSpy).not.toHaveBeenCalled();

      setItemSpy.mockRestore();
    });
  });

  describe("failed registration", () => {
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

  describe("invalid credentials / input", () => {
    it("throws when email is not a stud.noroff.no address", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Email must be a valid stud.noroff.no address" }]),
      );

      await expect(
        register({ ...validInput, email: "user@gmail.com" }),
      ).rejects.toThrow("Email must be a valid stud.noroff.no address");
    });

    it("still sends the request for an invalid email (server-side validation)", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Email must be a valid stud.noroff.no address" }]),
      );

      await expect(
        register({ ...validInput, email: "user@gmail.com" }),
      ).rejects.toThrow();

      const body = JSON.parse(mockFetchData.mock.calls[0][1].body);
      expect(body.email).toBe("user@gmail.com");
    });

    it("throws when password is too short", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Password must be at least 8 characters" }]),
      );

      await expect(
        register({ ...validInput, password: "short" }),
      ).rejects.toThrow("Password must be at least 8 characters");
    });

    it("throws when the username contains invalid characters", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Name can only use a-Z, 0-9, and _" }]),
      );

      await expect(
        register({ ...validInput, name: "invalid name!" }),
      ).rejects.toThrow("Name can only use a-Z, 0-9, and _");
    });

    it("throws when the profile already exists (duplicate registration)", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Profile already exists" }]),
      );

      await expect(register(validInput)).rejects.toThrow("Profile already exists");
    });

    it("throws when the email is already in use", async () => {
      mockFetchData.mockResolvedValue(
        mockErrorResponse([{ message: "Email is already registered" }]),
      );

      await expect(
        register({ ...validInput, email: "taken@stud.noroff.no" }),
      ).rejects.toThrow("Email is already registered");
    });

    it("propagates a network error", async () => {
      mockFetchData.mockRejectedValue(new Error("Failed to fetch"));

      await expect(register(validInput)).rejects.toThrow("Failed to fetch");
    });
  });
});
