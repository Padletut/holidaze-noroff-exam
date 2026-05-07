import { describe, it, expect } from "vitest";
import { formatLongDate } from "../formatLongDate.mjs";

describe("formatLongDate()", () => {
  it("formats a date as 'D. Month' (en-GB)", () => {
    expect(formatLongDate("2026-04-22")).toBe("22. April");
  });

  it("returns an empty string for null input", () => {
    expect(formatLongDate(null)).toBe("");
  });

  it("returns an empty string for undefined input", () => {
    expect(formatLongDate(undefined)).toBe("");
  });

  it("returns an empty string for an empty string", () => {
    expect(formatLongDate("")).toBe("");
  });

  it("handles January 1st without timezone drift", () => {
    expect(formatLongDate("2026-01-01")).toBe("1. January");
  });

  it("handles December 31st without timezone drift", () => {
    expect(formatLongDate("2026-12-31")).toBe("31. December");
  });
});
