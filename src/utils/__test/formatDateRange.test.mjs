import { describe, it, expect } from "vitest";
import { formatDateRange } from "../formatDateRange.mjs";

describe("formatDateRange()", () => {
  it("formats a range as 'D Mon – D Mon'", () => {
    expect(formatDateRange("2026-04-22", "2026-04-24")).toBe("22 Apr – 24 Apr");
  });

  it("handles a range spanning months", () => {
    expect(formatDateRange("2026-04-28", "2026-05-03")).toBe(
      "28 Apr – 3 May",
    );
  });

  it("handles a range spanning years", () => {
    expect(formatDateRange("2025-12-30", "2026-01-02")).toBe(
      "30 Dec – 2 Jan",
    );
  });

  it("formats a single-day range", () => {
    expect(formatDateRange("2026-06-01", "2026-06-01")).toBe("1 Jun – 1 Jun");
  });
});
