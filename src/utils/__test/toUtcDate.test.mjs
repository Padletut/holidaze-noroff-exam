import { describe, it, expect } from "vitest";
import toUtcDate from "../toUtcDate.mjs";

describe("toUtcDate()", () => {
  it("parses a valid ISO date string into a UTC Date", () => {
    const result = toUtcDate("2026-04-22");

    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe("2026-04-22T00:00:00.000Z");
  });

  it("returns null for null input", () => {
    expect(toUtcDate(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(toUtcDate(undefined)).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(toUtcDate("")).toBeNull();
  });

  it("ignores time components and uses only the date part", () => {
    const result = toUtcDate("2026-04-22T15:30:00.000Z");

    expect(result.toISOString()).toBe("2026-04-22T00:00:00.000Z");
  });
});
