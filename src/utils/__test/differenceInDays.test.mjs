import { describe, it, expect } from "vitest";
import { differenceInDays } from "../differenceInDays.mjs";

describe("differenceInDays()", () => {
  it("returns the number of days between two dates", () => {
    expect(differenceInDays("2026-04-01", "2026-04-06")).toBe(5);
  });

  it("returns 0 for the same date", () => {
    expect(differenceInDays("2026-04-22", "2026-04-22")).toBe(0);
  });

  it("returns 0 when from is null", () => {
    expect(differenceInDays(null, "2026-04-22")).toBe(0);
  });

  it("returns 0 when to is null", () => {
    expect(differenceInDays("2026-04-22", null)).toBe(0);
  });

  it("returns 0 when both inputs are null", () => {
    expect(differenceInDays(null, null)).toBe(0);
  });

  it("correctly spans a month boundary", () => {
    expect(differenceInDays("2026-01-28", "2026-02-03")).toBe(6);
  });

  it("correctly spans a year boundary", () => {
    expect(differenceInDays("2025-12-30", "2026-01-02")).toBe(3);
  });
});
