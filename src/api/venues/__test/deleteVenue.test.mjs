import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../../config.mjs", () => ({ BASE_URL: "https://test-api.noroff.dev/api/v2" }));

const mockFetchData = vi.fn();
vi.mock("../../utils/fetchdata.mjs", () => ({ fetchData: mockFetchData }));

const { deleteVenue } = await import("../deleteVenue.mjs");

// ─── tests ────────────────────────────────────────────────────────────────────

describe("deleteVenue()", () => {
  beforeEach(() => mockFetchData.mockReset());

  it("sends a DELETE request to the correct venue URL", async () => {
    mockFetchData.mockResolvedValue({ ok: true });

    await deleteVenue("venue-1");

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("/holidaze/venues/venue-1"),
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("URL-encodes special characters in the venue ID", async () => {
    mockFetchData.mockResolvedValue({ ok: true });

    await deleteVenue("venue 1");

    expect(mockFetchData).toHaveBeenCalledWith(
      expect.stringContaining("venue%201"),
      expect.anything(),
    );
  });

  it("resolves with undefined on a successful delete (204-style)", async () => {
    mockFetchData.mockResolvedValue({ ok: true });

    const result = await deleteVenue("venue-1");

    expect(result).toBeUndefined();
  });

  it("throws the API error message on failure", async () => {
    mockFetchData.mockResolvedValue({
      ok: false,
      json: async () => ({ errors: [{ message: "You are not the owner of this venue" }] }),
    });

    await expect(deleteVenue("venue-1")).rejects.toThrow(
      "You are not the owner of this venue",
    );
  });

  it("throws the fallback message when errors array is empty", async () => {
    mockFetchData.mockResolvedValue({
      ok: false,
      json: async () => ({ errors: [] }),
    });

    await expect(deleteVenue("venue-1")).rejects.toThrow(
      "We couldn't delete the venue right now. Please try again.",
    );
  });

  it("throws the fallback message when json() itself throws (empty body)", async () => {
    mockFetchData.mockResolvedValue({
      ok: false,
      json: async () => {
        throw new SyntaxError("Unexpected end of JSON input");
      },
    });

    await expect(deleteVenue("venue-1")).rejects.toThrow(
      "We couldn't delete the venue right now. Please try again.",
    );
  });

  it("propagates a network error", async () => {
    mockFetchData.mockRejectedValueOnce(new Error("Failed to fetch"));

    const error = await deleteVenue("venue-1").catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Failed to fetch");
  });
});
