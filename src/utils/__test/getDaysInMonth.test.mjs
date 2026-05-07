import { describe, it, expect } from "vitest";
import { getDaysInMonth } from "../getDaysInMonth.mjs";

describe("getDaysInMonth()", () => {
  it("returns 31 for January", () => {
    expect(getDaysInMonth(2026, 0)).toBe(31);
  });

  it("returns 28 for February in a non-leap year", () => {
    expect(getDaysInMonth(2025, 1)).toBe(28);
  });

  it("returns 29 for February in a leap year", () => {
    expect(getDaysInMonth(2024, 1)).toBe(29);
  });

  it("returns 30 for April", () => {
    expect(getDaysInMonth(2026, 3)).toBe(30);
  });

  it("returns 31 for December", () => {
    expect(getDaysInMonth(2026, 11)).toBe(31);
  });
});
