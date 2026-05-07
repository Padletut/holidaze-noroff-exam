import { describe, it, expect } from "vitest";
import { toDateStr } from "../toDateStr.mjs";

describe("toDateStr()", () => {
  it("formats a standard date correctly", () => {
    expect(toDateStr(2026, 3, 22)).toBe("2026-04-22");
  });

  it("zero-pads single-digit months", () => {
    expect(toDateStr(2026, 0, 5)).toBe("2026-01-05");
  });

  it("zero-pads single-digit days", () => {
    expect(toDateStr(2026, 11, 1)).toBe("2026-12-01");
  });

  it("handles December (month index 11) correctly", () => {
    expect(toDateStr(2026, 11, 31)).toBe("2026-12-31");
  });

  it("handles January (month index 0) correctly", () => {
    expect(toDateStr(2026, 0, 1)).toBe("2026-01-01");
  });
});
