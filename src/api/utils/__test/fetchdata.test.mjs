import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock headers so we can isolate fetchData behaviour
const mockHeaders = vi.fn(() => new Headers());
vi.mock("../headers.mjs", () => ({ headers: mockHeaders }));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const { fetchData } = await import("../fetchdata.mjs");

// ─── tests ────────────────────────────────────────────────────────────────────

describe("fetchData()", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockHeaders.mockReset();
    mockHeaders.mockReturnValue(new Headers());
  });

  it("calls fetch with the provided URL", async () => {
    mockFetch.mockResolvedValue({ ok: true });

    await fetchData("https://api.example.com/resource");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/resource",
      expect.any(Object),
    );
  });

  it("calls headers(false) when no body is provided", async () => {
    mockFetch.mockResolvedValue({ ok: true });

    await fetchData("https://api.example.com/resource");

    expect(mockHeaders).toHaveBeenCalledWith(false);
  });

  it("calls headers(true) when a body is provided", async () => {
    mockFetch.mockResolvedValue({ ok: true });

    await fetchData("https://api.example.com/resource", {
      method: "POST",
      body: JSON.stringify({ name: "test" }),
    });

    expect(mockHeaders).toHaveBeenCalledWith(true);
  });

  it("merges extra options into the fetch call", async () => {
    mockFetch.mockResolvedValue({ ok: true });

    await fetchData("https://api.example.com/resource", { method: "DELETE" });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("returns the raw response object", async () => {
    const fakeResponse = { ok: true, status: 200 };
    mockFetch.mockResolvedValue(fakeResponse);

    const result = await fetchData("https://api.example.com/resource");

    expect(result).toBe(fakeResponse);
  });

  it("propagates a network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const error = await fetchData("https://api.example.com/resource").catch(
      (e) => e,
    );
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Network error");
  });
});
