import { describe, it, expect } from "vitest";
import { getFirstWeekday } from "../getFirstWeekday.mjs";

// Monday = 0, Tuesday = 1, ..., Sunday = 6

describe("getFirstWeekday()", () => {
  it("returns 0 (Monday) for April 2024 — starts on Monday", () => {
    // 1 April 2024 is a Monday
    expect(getFirstWeekday(2024, 3)).toBe(0);
  });

  it("returns 5 (Saturday) for March 2025 — starts on Saturday", () => {
    // 1 March 2025 is a Saturday
    expect(getFirstWeekday(2025, 2)).toBe(5);
  });

  it("returns 6 (Sunday) for June 2025 — starts on Sunday", () => {
    // 1 June 2025 is a Sunday
    expect(getFirstWeekday(2025, 5)).toBe(6);
  });

  it("returns 3 (Thursday) for January 2026 — starts on Thursday", () => {
    // 1 January 2026 is a Thursday
    expect(getFirstWeekday(2026, 0)).toBe(3);
  });
});
