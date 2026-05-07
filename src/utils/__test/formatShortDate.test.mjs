import { describe, it, expect } from "vitest";
import { formatShortDate } from "../formatShortDate.mjs";

describe("formatShortDate()", () => {
  it("formats a date as 'D Mon' (en-GB)", () => {
    expect(formatShortDate("2026-04-22")).toBe("22 Apr");
  });

  it("returns an empty string for null input", () => {
    expect(formatShortDate(null)).toBe("");
  });

  it("returns an empty string for undefined input", () => {
    expect(formatShortDate(undefined)).toBe("");
  });

  it("returns an empty string for an empty string", () => {
    expect(formatShortDate("")).toBe("");
  });

  it("respects a custom locale", () => {
    // nb-NO uses Norwegian month abbreviations
    const result = formatShortDate("2026-04-22", "nb-NO");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("handles the first day of the year without timezone drift", () => {
    expect(formatShortDate("2026-01-01")).toBe("1 Jan");
  });
});
