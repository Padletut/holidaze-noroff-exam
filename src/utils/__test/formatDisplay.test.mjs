import { describe, it, expect } from "vitest";
import { formatDisplay } from "../formatDisplay.mjs";

describe("formatDisplay()", () => {
  it("converts an ISO string to DD.MM.YYYY", () => {
    expect(formatDisplay("2026-04-22")).toBe("22.04.2026");
  });

  it("zero-pads single-digit months and days", () => {
    expect(formatDisplay("2026-01-05")).toBe("05.01.2026");
  });

  it("returns null for null input", () => {
    expect(formatDisplay(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(formatDisplay(undefined)).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(formatDisplay("")).toBeNull();
  });
});
