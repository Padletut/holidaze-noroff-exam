import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Mock loadStorage so we can control the stored access token
const mockLoadStorage = vi.fn();
vi.mock("../../../utils/loadStorage.mjs", () => ({ loadStorage: mockLoadStorage }));

// headers.mjs captures import.meta.env.VITE_API_KEY at module load time;
// in the test environment it will be undefined, so we test that branch too.
const { headers } = await import("../headers.mjs");

// ─── tests ────────────────────────────────────────────────────────────────────

describe("headers()", () => {
  beforeEach(() => mockLoadStorage.mockReset());

  it("returns a Headers instance", () => {
    mockLoadStorage.mockReturnValue(null);

    const result = headers();

    expect(result).toBeInstanceOf(Headers);
  });

  it("adds Authorization header when an access token is stored", () => {
    mockLoadStorage.mockReturnValue("my-token");

    const result = headers();

    expect(result.get("Authorization")).toBe("Bearer my-token");
  });

  it("does not add Authorization header when no token is stored", () => {
    mockLoadStorage.mockReturnValue(null);

    const result = headers();

    expect(result.get("Authorization")).toBeNull();
  });

  it("adds Content-Type: application/json when hasBody is true", () => {
    mockLoadStorage.mockReturnValue(null);

    const result = headers(true);

    expect(result.get("Content-Type")).toBe("application/json");
  });

  it("does not add Content-Type when hasBody is false (default)", () => {
    mockLoadStorage.mockReturnValue(null);

    const result = headers();

    expect(result.get("Content-Type")).toBeNull();
  });

  it("loads the token using the 'accessToken' key", () => {
    mockLoadStorage.mockReturnValue(null);

    headers();

    expect(mockLoadStorage).toHaveBeenCalledWith("accessToken");
  });
});
